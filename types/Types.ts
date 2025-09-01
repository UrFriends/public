import { User } from "@firebase/auth";
import { UseMutationResult } from "@tanstack/react-query";

//TODO: develop the type system
export interface Person {
  name: {
    first: string;
    last: string;
  };
  id?: string;
  user?: string;
  tier?: number | string;
  phoneNumber?: number | string;
  lastConvo?: Record<string, Conversation>
  docID?: string;
  email?: string;
}

export type ISODateString = string;

export interface Conversation {
    date: ISODateString | null;
    topic: string | null;
    DocID?: string;
  }

export interface Modal__Props {
  data?: any;
  user?: any;
}

export interface ReachOut__Props {
  data?: any;
  user?: User;
}

export interface RecentConversations__Props {
  person: Person,
  conversationArray: Conversation[]
}

export interface ContactSettings__Props {
 user: User;
}

export interface ModifyDataButton__Props {
  clickHandler: () => void;
  keyToEdit?: any;
  text?: string;
}

export interface ChangeableInput__Props {
  valueProp: string | number;
  valueSwitch: string | number;
  mutation?: UseMutationResult<
    boolean,
    Error,
    {
      changeQualifier: string | number;
      keyToChange: string | number;
      change: string | number;
    },
    unknown
  >;
}

export interface LocalSettings {
  locally_storing: boolean;
  settings?: {
    tiersTime?: object;
  };
}

export interface TierSettings__Props {
  settings: {
    tiersTime: tiersTime_Object[];
  };
  user: User;
}


export interface tiersTime_Object {
  name: string;
  timeFrame: string;
}


export interface NewPerson__Props {
  user: {
    uid: string
  };
  settings: {
    tiersTime: tiersTime_Object[] | tiersTime_Object | null;
  };
}

export interface ContactCard__Props {
  lastContact: Conversation,
  person: Person,
  windowOfLastContact: string,
  conversationArray: Conversation[]
}
