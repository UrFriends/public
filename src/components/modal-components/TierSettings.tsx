import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dayChoices, interpolateTierTimePeriod } from "@/hooks/getDateFromDateTime";
import { sendNotification } from "@/hooks/sendNotification";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { add_Tier, changeProperty_Tier, delete_Tier } from "../../../services/fireBaseServices";
import { TierSettings__Props, tiersTime_Object } from "../../../types/Types";
import { ChangeableInput } from "../ChangeableInput";

function BillingButton() {
    const openBillingPortal = () => {
        window.location.href =
            "https://billing.stripe.com/p/login/28E00j8WE0Oy3D03i5fEk00";
    };

    return (
        <button
            className="inline-flex items-center justify-center rounded-lg border border-[#8f7655] bg-[#f3dfc2] px-5 py-2.5 text-sm font-medium text-[#2b1a14] shadow-sm transition-all duration-200 ease-out hover:bg-[#edd3ae] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#c4a484] focus:ring-offset-2"
            onClick={openBillingPortal}
        >
            Manage Subscription
        </button>
    );
}

type TierMutationVariables = {
    changeQualifier: string | number;
    keyToChange: string | number;
    change: string | number;
};

const TierRow = ({
    tier,
    changeTierMutation,
    onDelete,
    onTimeframeChange,
}: {
    tier: tiersTime_Object;
    changeTierMutation: UseMutationResult<unknown, unknown, TierMutationVariables, unknown>;
    onDelete: (tierName: string) => void;
    onTimeframeChange: (tierName: string, value: string) => Promise<void>;
}) => {
    const [selectedTimeFrame, setSelectedTimeFrame] = useState(tier.timeFrame);

    const handleSelect_timeFrameChange = async (value: string) => {
        setSelectedTimeFrame(value);
        await onTimeframeChange(tier.name, value);
    };

    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Tier name
                    </p>
                    <ChangeableInput
                        mutation={changeTierMutation}
                        valueProp={tier.name}
                        valueSwitch={"name"}
                    />
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(tier.name)}
                    className="self-start"
                >
                    Delete
                </Button>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reminder cadence
                </p>
                <Select
                    onValueChange={handleSelect_timeFrameChange}
                    value={selectedTimeFrame}
                    defaultValue={tier.timeFrame}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayChoices.map((choice) => (
                            <SelectItem value={choice} key={`${choice}-key-select`}>
                                {interpolateTierTimePeriod(choice)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const TierSettings = (props: TierSettings__Props) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const changeTierMutation = useMutation<unknown, unknown, TierMutationVariables>({
        mutationFn: async (variables) => {
            let unused_tier = true;
            if (props.settings.tiersTime && variables.keyToChange === "name") {
                props.settings.tiersTime.forEach((tier) => {
                    if (tier.name == variables.change) {
                        unused_tier = false;
                    }
                });
            }
            if (unused_tier || variables.keyToChange !== "name") {
                return await changeProperty_Tier(
                    props.user?.uid,
                    variables.changeQualifier,
                    variables.keyToChange,
                    variables.change,
                );
            } else {
                sendNotification(dispatch, { message: "Tiers may not share the same name", type: "red" });
                throw new Error("Tiers may not share the same name");
            }
        },
        onSuccess: () => {
            sendNotification(dispatch, { message: "Property successfully changed!", type: "green" });
            queryClient.invalidateQueries({ queryKey: ["userData"] });
        },
        onError: (error) => {
            sendNotification(dispatch, { message: "failure to change tier property", type: "red" });
            console.log("Error", error);
        },
    });

    if (!props.settings) {
        return null;
    }

    const handleDeleteTier = (tierName: string) => {
        delete_Tier(props.user?.uid, tierName, dispatch);
    };

    const handleUpdateTier = async (
        changeQualifier: string,
        keyToChange: string,
        change: string,
    ) => {
        await changeTierMutation.mutateAsync({ changeQualifier, keyToChange, change });
    };

    const handleAddTier = async (form: HTMLFormElement) => {
        const tierNameInput = form.elements.namedItem("tierName") as HTMLInputElement | null;
        if (tierNameInput && tierNameInput.value.trim().length > 0) {
            try {
                await add_Tier(props.user?.uid, tierNameInput.value.trim(), dispatch);
                queryClient.invalidateQueries({ queryKey: ["userData"] });
                tierNameInput.value = "";
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (props.settings && Object.hasOwn(props.settings, "tiersTime")) {
        return (
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-white">Tier cadence & billing</h3>
                            <p className="text-sm text-slate-400">
                                Adjust how often each tier nudges you to reach out. Contacts inherit the cadence of their assigned tier.
                            </p>
                        </div>
                        <BillingButton />
                    </div>
                </div>

                <div className="space-y-4">
                    {Array.isArray(props.settings?.tiersTime) && props.settings.tiersTime.map((tier) => (
                        <TierRow
                            key={`${tier.name}-key-settings`}
                            tier={tier}
                            changeTierMutation={changeTierMutation}
                            onDelete={handleDeleteTier}
                            onTimeframeChange={(tierName, value) =>
                                handleUpdateTier(tierName, "timeFrame", value)
                            }
                        />
                    ))}
                </div>

                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-4">
                    <form
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        method="post"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleAddTier(event.currentTarget);
                        }}
                    >
                        <div className="flex-1 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Add a new tier
                            </p>
                            <input
                                name="tierName"
                                placeholder="e.g., VIP Clients"
                                className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                            />
                        </div>
                        <Button type="submit" className="whitespace-nowrap">
                            Add Tier
                        </Button>
                    </form>
                </div>
            </div>
        );
    } else {
        console.log("ERROR: TierSettings difficulty loading tiersTime");
        return null;
    }
};

export default TierSettings;
