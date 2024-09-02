export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'lead' : IDL.Text,
    'name' : IDL.Text,
    'completed' : IDL.Opt(IDL.Bool),
    'dueDate' : Time,
    'category' : IDL.Text,
    'project' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func(
        [IDL.Text, IDL.Text, Time, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'getHealth' : IDL.Func([], [IDL.Text], ['query']),
    'getTasks' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(Task)))],
        ['query'],
      ),
    'markTaskComplete' : IDL.Func([IDL.Nat], [], []),
    'removeTask' : IDL.Func([IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
