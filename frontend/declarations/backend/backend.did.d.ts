import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Task {
  'id' : bigint,
  'lead' : string,
  'name' : string,
  'completed' : [] | [boolean],
  'dueDate' : Time,
  'category' : string,
  'project' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addTask' : ActorMethod<[string, string, Time, string, string], undefined>,
  'getHealth' : ActorMethod<[], string>,
  'getTasks' : ActorMethod<[], Array<[string, Array<Task>]>>,
  'markTaskComplete' : ActorMethod<[bigint], undefined>,
  'removeTask' : ActorMethod<[bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
