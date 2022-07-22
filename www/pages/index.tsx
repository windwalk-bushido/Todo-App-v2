import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import Todo from "../class";

const URL = "http://api:8000/todos/";
//const URL = "https://dog-api.kinduff.com/api/facts?number=5"; // radi

export const getServerSideProps = async () => {
  let fetched_todos: any = [];

  await axios
    .get(URL)
    .then((response) => {
      fetched_todos = response["data"];
      console.log(fetched_todos);
    })
    .catch((error) => {
      console.log(error);
    });

  return {
    props: {
      fetched_todos,
    },
  };
};

const Index = ({ fetched_todos }: any) => {
  const [todos, setTodos] = useState([fetched_todos]);
  const [temp_todo_item, setTempTodo] = useState("");
  const [edit_index, setEditIndex] = useState(-1);
  const [delete_index, setDeleteIndex] = useState(-1);
  const [disable_control, setDisableControl] = useState(false);

  const AddTodo = async () => {
    if (temp_todo_item !== "" && edit_index === -1) {
      const new_todo: Object = new Todo(temp_todo_item, false);

      let todo_list: any = todos.slice();
      console.log("PRE");
      console.log(todo_list);
      todo_list[0].push(new_todo);
      console.log("AFTER");
      console.log(todo_list);
      setTodos(todo_list);

      await axios
        .post(URL + "add/", {
          data: new_todo,
        })
        .then((response) => {
          console.log(response["data"]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // EditTodo()
    if (temp_todo_item !== "" && edit_index !== -1) {
      let todo_list: any = todos.slice();
      todo_list[edit_index].body = temp_todo_item;
      setTodos(todo_list);

      const updated_todo = new Todo(todo_list[edit_index].body, todo_list[edit_index].done);

      await axios
        .put(URL + "update/" + todo_list[edit_index].id, {
          data: updated_todo,
        })
        .then((response) => {
          console.log(response["data"]);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTempTodo("");
    setEditIndex(-1);
    setDisableControl(false);

    const todo_input = document.getElementById("todo_input") as HTMLFormElement;
    todo_input.focus();
  };

  const DoneTodo = async (index: number) => {
    let todo_list: any = todos.slice();
    todo_list[index].done = !todo_list[index].done;
    setTodos(todo_list);

    const done_todo = new Todo(todo_list[index].body, todo_list[index].done);

    await axios
      .put(URL + "update/" + todo_list[index].index, {
        data: done_todo,
      })
      .then((response) => {
        console.log(response["data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const EditTodo = (index: number) => {
    let todo_list: any = todos.slice();
    setTempTodo(todo_list[index].body);
    setEditIndex(index);

    const input = document.getElementById("todo_input") as HTMLFormElement;
    input.focus();
  };

  const DeleteTodo = async () => {
    let todo_list: any = todos.slice();
    const number = todo_list[delete_index].id;

    await axios
      .delete(URL + "delete/", {
        data: number,
      })
      .then((response) => {
        console.log(response["data"]);
      })
      .catch((error) => {
        console.log(error);
      });

    todo_list.splice(delete_index, 1);
    setDeleteIndex(-1);
  };

  const HandleModal = (command: number) => {
    const modal = document.getElementById("modal") as HTMLElement;
    if (command === 1) {
      modal.classList.remove("hidden");
    } else if (command === 0) {
      modal.classList.add("hidden");
    }
  };

  return (
    <>
      <Head>
        <title>Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-start items-center w-screen h-screen">
        <div className={"flex justify-center w-full pt-1 pb-1 " + (edit_index === -1 ? "bg-green-600 text-white" : "bg-yellow-500 text-black")}>
          <p className="text-lg">{edit_index === -1 ? "Ready" : "Editing mode"}</p>
        </div>

        <main className="app flex flex-col justify-center w-full mt-4">
          <h1 className="mt-2 text-center text-4xl">Todo App</h1>

          <div className="flex justify-center items-center w-full mt-12">
            <input className="p-2 rounded-tl-3xl rounded-bl-3xl text-xl input bg-gray-700 " type="text" placeholder="Buy 3 bottles of milk" id="todo_input" onChange={(e) => setTempTodo(e.target.value)} />
            <button className="flex justify-center items-center w-12 h-12 p-2 rounded-tr-3xl rounded-br-3xl text-2xl transition-all duration-100 ease-linear bg-blue-700 text-white hover:bg-blue-300 hover:text-black" onClick={() => AddTodo()}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="flex flex-col justify-center w-full mt-24 mb-8 pl-2 pr-2">
            <h6 className="mb-8 text-center text-2xl">List:</h6>

            <div className="flex flex-col justify-center w-full">
              {todos[0].map((todo: any, index: any) => {
                return (
                  <article className={"p-4 mb-6 rounded-3xl " + (todo.done ? "bg-gray-900" : "shadow-xl bg-gray-800")} key={index}>
                    <main className={"w-full mb-4 break-words " + (todo.done ? "line-through" : "no-underline")}>
                      <p>{todo.body}</p>
                    </main>
                    <footer className="flex justify-end w-full">
                      <button
                        className={
                          "flex justify-center items-center w-8 h-8 p-2 rounded-full shadow-xl " + (!disable_control ? "transition-all ease-linear duration-100 bg-green-600 text-white hover:bg-green-300 hover:text-black" : "bg-gray-500 text-white")
                        }
                        onClick={() => {
                          !disable_control ? DoneTodo(index) : "";
                        }}
                        disabled={disable_control}
                      >
                        <FontAwesomeIcon className="text-xl" icon={faCheck} />
                      </button>

                      <button
                        className={
                          "flex justify-center items-center w-8 h-8 p-2 ml-1 mr-1 rounded-full shadow-xl " + (!todo.done ? "transition-all ease-linear duration-100 bg-yellow-600 text-white hover:bg-yellow-300 hover:text-black" : "bg-gray-500 text-white")
                        }
                        onClick={() => {
                          !todo.done ? (EditTodo(index), setDisableControl(true)) : "";
                        }}
                        disabled={todo.done}
                      >
                        <FontAwesomeIcon className="text-lg" icon={faPen} />
                      </button>

                      <button
                        className={"flex justify-center items-center w-8 h-8 p-2 rounded-full shadow-xl " + (!todo.done ? "bg-gray-500 text-white" : "transition-all ease-linear duration-100 bg-red-600 text-white hover:bg-red-300 hover:text-black")}
                        disabled={!todo.done}
                        onClick={() => {
                          todo.done ? (setDeleteIndex(index), HandleModal(1)) : "";
                        }}
                      >
                        <FontAwesomeIcon className="text-lg" icon={faTrash} />
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </main>

        <div className={"hidden w-screen h-screen justify-center items-center z-10 absolute my-padding-60 " + (delete_index !== -1 ? "flex" : "hidden")} id="modal">
          <div className="flex flex-col justify-center items-center p-8 rounded-3xl shadow-xl bg-gray-700">
            <p className="text-2xl mb-8">Are you sure?</p>
            <div>
              <button
                className="mr-2 p-3 rounded-full hover:shadow-xl transition-all ease-linear duration-100 hover:opacity-100 bg-white text-black hover:bg-gray-300 hover:text-black"
                onClick={() => {
                  HandleModal(0);
                }}
              >
                Cancel
              </button>
              <button
                className="ml-2 p-3 text-bold rounded-full shadow-xl transition-all ease-linear duration-100 hover:opacity-100 bg-red-600 text-white hover:bg-red-300 hover:text-black"
                onClick={() => {
                  DeleteTodo();
                  HandleModal(0);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
