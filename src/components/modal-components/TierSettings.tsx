import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { sendNotification } from "@/hooks/sendNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { add_Tier, changeProperty_Tier, delete_Tier } from "../../../services/fireBaseServices";
import { TierSettings__Props } from "../../../types/Types";
import { ChangeableInput } from "../ChangeableInput";

const dayChoices = ["1d", "2d", "3d", "4d", "5d", "6d", "1w", "2w", "3w", "1m", "2m", "3m", "4m", "5m", "6m", "u"]

function interpolateTierTimePeriod(timePeriod: string) {
    switch (timePeriod) {
        case "1d":
            return "1 Day";
        case "2d":
            return "2 Days";
        case "3d":
            return "3 Days";
        case "4d":
            return "4 Days";
        case "5d":
            return "5 Days";
        case "6d":
            return "6 Days";
        case "1w":
            return "1 Week";
        case "2w":
            return "2 Weeks";
        case "3w":
            return "3 Weeks";
        case "1m":
            return "1 Month";
        case "2m":
            return "2 Months";
        case "3m":
            return "3 Months";
        case "4m":
            return "4 Months";
        case "5m":
            return "5 Months";
        case "6m":
            return "6 Months";
        case "u":
            return "No Timeframe"
        default:
            return "Time Frame Error";
    }
}

const TierSettings = (props: TierSettings__Props) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient()
    const changeTierMutation = useMutation({
        mutationFn: async (variables: { changeQualifier: string | number, keyToChange: string | number, change: string | number }) => {
            // changeQualifier = original name of tier to change (it may/not be that the name of the tier needs to change in the mutation)
            // prevent tiers from sharing same name
            let unused_tier = true;
            if (props.settings.tiersTime) {
                props.settings.tiersTime.forEach((tier) => {
                    if (tier.name == variables.change) {
                        unused_tier = false;
                    }
                })
            }
            if (unused_tier) {
                //change the property
                return await changeProperty_Tier(props.user?.uid, variables.changeQualifier, variables.keyToChange, variables.change);
            } else {
                sendNotification(dispatch, { message: "Tiers may not share the same name", type: "red" });
                throw new Error('Tiers may not share the same name');
            }
        },
        onSuccess: (data, variables, context) => {
            sendNotification(dispatch, { message: "Property successfully changed!", type: "green" });
            queryClient.invalidateQueries({ queryKey: ['userData'] });
        },
        onError: (error) => {
            sendNotification(dispatch, { message: "failure to change tier property", type: "red" });
            console.log("Error", error)
        }
    })

    if (!props.settings) {
        return null;
    }

    if (props.settings && Object.hasOwn(props.settings, "tiersTime")) {
        return (
            <div>
                {Array.isArray(props.settings?.tiersTime) && props.settings.tiersTime.map((tier) => {
                    const [selectedTimeFrame, setSelectedTimeFrame] = useState(tier.timeFrame)

                    const handleSelect_timeFrameChange = async (value: string) => {
                        setSelectedTimeFrame(value);
                        changeTierMutation.mutateAsync({ changeQualifier: tier.name, keyToChange: "timeFrame", change: value })
                    }

                    return (
                        <div className="p-1 flex m-1 border-solid border-2 border-black bg-pink-400" key={`${tier.name}-key-settings`}>
                            <div className="inline-block">
                                <ChangeableInput mutation={changeTierMutation} valueProp={tier.name} valueSwitch={"name"} />
                            </div>
                            <div className="bg-green-700">
                                <div>
                                    <Select onValueChange={handleSelect_timeFrameChange} value={selectedTimeFrame} defaultValue={tier.timeFrame}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Time Period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dayChoices.map((choice) => {
                                                return (
                                                    <SelectItem value={choice} key={`${choice}-key-select`}>
                                                        {interpolateTierTimePeriod(choice)}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>
                            <div>
                                <Button onClick={() => delete_Tier(props.user?.uid, tier.name, dispatch)}>Delete</Button>
                            </div>
                        </div>
                    )
                })
                }

                <div>
                    <form method="post" onSubmit={(event) => {
                        event.preventDefault();
                        const form = event.target as HTMLFormElement;
                        const tierNameInput = form.elements.namedItem("tierName") as HTMLInputElement | null;
                        if (tierNameInput) {
                            const call__add_Tier = async () => {
                                try {
                                    await add_Tier(props.user?.uid, tierNameInput.value, dispatch);
                                    queryClient.invalidateQueries({ queryKey: ['userData'] });

                                    // setTimeout(() => {
                                    //     // location.reload();
                                    //     return true;
                                    // }, 1200)

                                } catch (err) {
                                    console.error(err);
                                }
                            };
                            call__add_Tier();
                        }
                    }}>
                        <input name="tierName"
                        ></input>
                        <Button >Add Tier</Button>
                    </form>
                </div>
            </div>
        )
    } else {
        console.log("ERROR: TierSettings difficulty loading tiersTime")
    }
}

export default TierSettings
