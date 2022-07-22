import { useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

//const URL = "https://todo-api.dev.django/todos/";               <--- Should be using this but since it's HTTPS but it won't work
//const URL = "http://api:8000/todos/";                           <--- Only GET method works
const URL = "https://windwalks-todo-api.herokuapp.com/todos/"; // <--- API deployed on Heroku since Axios needs the Next and Django to be on HTTPS aswell

const DEBUG = false; // true => CRUD data on Client Side, false => CRUD data by sending it to Django API

export const getServerSideProps = async () => {
  let fetched_todos: any = [];
  await axios
    .get(URL)
    .then((response) => {
      fetched_todos = response["data"];
      console.log(response["data"]);
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
  const [todos, setTodos] = useState(() => {
    if (fetched_todos.length > 0) {
      let prep_data: any = [];
      fetched_todos.map((todo: any) => {
        return prep_data.push(todo);
      });

      return prep_data;
    } else {
      return [];
    }
  });
  const [temp_todo_item, setTempTodo] = useState("");
  const [edit_index, setEditIndex] = useState(-1);
  const [delete_index, setDeleteIndex] = useState(-1);
  const [disable_control, setDisableControl] = useState(false);

  const GetRandomInt = () => {
    const min = Math.ceil(20);
    const max = Math.floor(50);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const FocusOnInput = () => {
    const todo_input = document.getElementById("todo_input") as HTMLFormElement;
    todo_input.focus();
  };

  const AddTodo = async () => {
    if (temp_todo_item !== "" && edit_index === -1) {
      if (!DEBUG) {
        let fetched_todo: any = null;
        await axios
          .post(URL + "add/", {
            body: temp_todo_item,
            done: false,
          })
          .then((response) => {
            fetched_todo = response["data"];
            console.log(response["data"]);
          })
          .catch((error) => {
            console.log(error);
          });

        setTodos((todos: any) => [...todos, fetched_todo]);
      } else {
        const new_todo = {
          id: GetRandomInt(),
          body: temp_todo_item,
          done: false,
        };

        setTodos((todos: any) => [...todos, new_todo]);
      }
    }

    // EditTodo()
    if (temp_todo_item !== "" && edit_index !== -1) {
      if (!DEBUG) {
        const updated_todo = {
          id: todos[edit_index]?.id,
          body: temp_todo_item,
          done: todos[edit_index]?.done,
        };
        await axios
          .put(URL + "update/" + todos[edit_index]?.id, {
            id: todos[edit_index]?.id,
            body: temp_todo_item,
            done: todos[edit_index]?.done,
          })
          .then((response) => {
            console.log(response["data"]);
          })
          .catch((error) => {
            console.log(error);
          });

        const todo_list: any = todos.slice();
        todo_list[edit_index] = updated_todo;
        setTodos(todo_list);
      } else {
        const updated_todo = todos[edit_index];
        updated_todo.body = temp_todo_item;

        const todo_list: any = todos.slice();
        todo_list[edit_index] = updated_todo;
        setTodos(todo_list);
      }
    }

    setTempTodo("");
    setEditIndex(-1);
    setDisableControl(false);
    FocusOnInput();
  };

  const EditTodo = (index: number) => {
    setTempTodo(todos[index].body);
    setEditIndex(index);
    FocusOnInput();
  };

  const DoneTodo = async (index: number) => {
    if (!DEBUG) {
      const updated_todo = {
        id: todos[index]?.id,
        body: todos[index]?.body,
        done: !todos[index]?.done,
      };
      await axios
        .put(URL + "update/" + todos[index]?.id, {
          id: todos[index]?.id,
          body: todos[index]?.body,
          done: !todos[index]?.done,
        })
        .then((response) => {
          console.log(response["data"]);
        })
        .catch((error) => {
          console.log(error);
        });

      const todo_list: any = todos.slice();
      todo_list[index] = updated_todo;
      setTodos(todo_list);
    } else {
      const updated_todo = todos[index];
      updated_todo.done = !updated_todo?.done;

      const todo_list: any = todos.slice();
      todo_list[index] = updated_todo;
      setTodos(todo_list);
    }
  };

  const DeleteTodo = async () => {
    if (!DEBUG) {
      const id_for_deletion = todos[delete_index]?.id;

      await axios
        .delete(URL + "delete/" + id_for_deletion)
        .then((response) => {
          console.log(response["data"]);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const todo_list: any = todos.slice();
    todo_list.splice(delete_index, 1);
    setTodos(todo_list);

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

      <main className="flex flex-col justify-start items-center w-full">
        <div className={"flex justify-center w-full fixed " + (edit_index === -1 ? "bg-green-600 text-white" : "bg-yellow-500 text-black")}>
          <p className="text-lg">{edit_index === -1 ? "Ready" : "Editing mode"}</p>
        </div>

        <main className="app flex flex-col justify-center w-full mt-12">
          <h1 className="mt-2 text-center text-4xl">Todo App</h1>

          <div className="flex justify-center items-center w-full mt-12">
            <input
              className="p-2 rounded-tl-3xl rounded-bl-3xl text-xl input bg-gray-700 "
              placeholder="Buy 3 bottles of milk"
              id="todo_input"
              type="text"
              value={temp_todo_item}
              onChange={(e) => setTempTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && AddTodo()}
            />
            <button className="flex justify-center items-center w-12 h-12 p-2 rounded-tr-3xl rounded-br-3xl text-2xl transition-all duration-100 ease-linear bg-blue-700 text-white hover:bg-blue-300 hover:text-black" onClick={() => AddTodo()}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="flex flex-col justify-center w-full mt-24 mb-8 pl-2 pr-2">
            <h3 className="mb-8 text-center text-2xl">List:</h3>

            <div className="flex flex-col justify-center w-full">
              {todos.map((todo: any, index: any) => {
                return (
                  <article className={"p-4 mb-6 rounded-3xl " + (todo?.done ? "bg-gray-900" : "shadow-xl bg-gray-800")} key={index}>
                    <main className={"w-full mb-4 break-words " + (todo?.done ? "line-through" : "no-underline")}>
                      <p>{todo?.body}</p>
                    </main>
                    <footer className="flex justify-end w-full">
                      <button
                        className={"flex justify-center items-center w-8 h-8 p-2 rounded-full shadow-xl " + (!disable_control ? "moss-animate bg-green-600 text-white hover:bg-green-300 hover:text-black" : "bg-gray-500 text-white")}
                        onClick={() => {
                          !disable_control && DoneTodo(index);
                        }}
                        disabled={disable_control}
                      >
                        <FontAwesomeIcon className="text-xl" icon={faCheck} />
                      </button>

                      <button
                        className={"flex justify-center items-center w-8 h-8 p-2 ml-1 mr-1 rounded-full shadow-xl " + (!todo?.done ? "moss-animate bg-yellow-600 text-white hover:bg-yellow-300 hover:text-black" : "bg-gray-500 text-white")}
                        onClick={() => {
                          !todo?.done && (EditTodo(index), setDisableControl(true));
                        }}
                        disabled={todo?.done}
                      >
                        <FontAwesomeIcon className="text-lg" icon={faPen} />
                      </button>

                      <button
                        className={"flex justify-center items-center w-8 h-8 p-2 rounded-full shadow-xl " + (!todo?.done ? "bg-gray-500 text-white" : "moss-animate bg-red-600 text-white hover:bg-red-300 hover:text-black")}
                        disabled={!todo?.done}
                        onClick={() => {
                          todo?.done && (setDeleteIndex(index), HandleModal(1));
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

        <div className={"w-full h-screen justify-center items-center z-10 absolute my-padding-60 " + (delete_index !== -1 ? "flex" : "hidden")} id="modal">
          <div className="flex flex-col justify-center items-center p-8 rounded-3xl shadow-xl bg-gray-700">
            <h6 className="text-2xl mb-12">Are you sure?</h6>
            <div>
              <button
                className="mr-2 p-3 rounded-full hover:shadow-xl moss-animate hover:opacity-100 bg-white text-black hover:bg-gray-300 hover:text-black"
                onClick={() => {
                  setDeleteIndex(-1);
                  HandleModal(0);
                }}
              >
                Cancel
              </button>
              <button
                className="ml-2 p-3 text-bold rounded-full shadow-xl moss-animate hover:opacity-100 bg-red-600 text-white hover:bg-red-300 hover:text-black"
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
