import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor {
  type Task = {
    id: Nat;
    name: Text;
    lead: Text;
    dueDate: Time.Time;
    project: Text;
    category: Text;
    completed: ?Bool;
  };

  stable var tasks: [Task] = [];
  stable var taskIdCounter: Nat = 0;

  private func getNextId(): Nat {
    taskIdCounter += 1;
    taskIdCounter
  };

  public query func getTasks(): async [(Text, [Task])] {
    let taskMap = HashMap.HashMap<Text, [Task]>(10, Text.equal, Text.hash);

    for (task in tasks.vals()) {
      let category = task.category;
      let existingTasks = switch (taskMap.get(category)) {
        case (null) { [] };
        case (?tasks) { tasks };
      };
      taskMap.put(category, Array.append(existingTasks, [task]));
    };

    Iter.toArray(taskMap.entries())
  };

  public shared(msg) func addTask(name: Text, lead: Text, dueDate: Time.Time, project: Text, category: Text): async () {
    assert(Text.size(name) > 0 and Text.size(lead) > 0 and Text.size(project) > 0 and Text.size(category) > 0);
    let newTask: Task = {
      id = getNextId();
      name = name;
      lead = lead;
      dueDate = dueDate;
      project = project;
      category = category;
      completed = null;
    };
    tasks := Array.append(tasks, [newTask]);
    Debug.print("Task added: " # debug_show(newTask));
  };

  public shared(msg) func removeTask(taskId: Nat): async () {
    tasks := Array.filter<Task>(tasks, func(task) { task.id != taskId });
    Debug.print("Task removed: " # debug_show(taskId));
  };

  public shared(msg) func markTaskComplete(taskId: Nat): async () {
    tasks := Array.map<Task, Task>(tasks, func(task) {
      if (task.id == taskId) {
        Debug.print("Task marked complete: " # debug_show(taskId));
        {
          id = task.id;
          name = task.name;
          lead = task.lead;
          dueDate = task.dueDate;
          project = task.project;
          category = task.category;
          completed = ?true;
        }
      } else {
        task
      }
    });
  };

  public query func getHealth(): async Text {
    "OK"
  };

  system func preupgrade() {
    Debug.print("Preparing for upgrade...");
  };

  system func postupgrade() {
    Debug.print("Upgrade complete. Task count: " # debug_show(taskIdCounter));
  };
}
