import Other = others.other;

namespace ajax_012 {
  class Index {
    run() {
      const other = new Other();
      other.start();
    }
  }
}

export {};
let message = "a";
console.log("a");

let p1: [string, number] = ["1", 22];
p1.push("a", 22);

interface Person {
  firstName: string;
  lastName?: string;
}

function fullName(person: Person) {
  console.log(`${person.firstName} ${person.lastName}`);
}

let p: Person = {
  firstName: "Shota",
  // lastName: "Touzaki",
};

fullName(p);
