//DONE//
"use client";

import { Controller, useForm } from "react-hook-form";
import InputField from "../components/InputField";

import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createCustom, deleteCustomField, getAllPermenentCustomFields, updateCustom } from "@/lib/actions";
import { ArrayOfCustomFields, arrayOfCustomFields,   customFieldZodResolver } from "@/lib/formValidationSchemas";
import { MdDelete } from "react-icons/md";

import { z } from "zod";
 
type FormData = {
  customFields: ArrayOfCustomFields;
  id?: number;
  fieldName?: string;
  moduleType?: "Student" | "Teacher" | "Parent";
  isRequired?: boolean;
  description?: string;

};


// One Option in the type SELECT box
const OneOption = ({ item, HandleDeleteOption, register, index, fieldId }: {
  item: string;
  HandleDeleteOption: any;
  register: any;
  index: any;
  fieldId: number;
}) => {
  return <div className="box p-[0.3rem] flex m-2  bg-sky-50 border-gray-300 flex-wrap rounded-lg w-fit border-2   ">
    <input type="text"
      className="w-fit  bg-transparent  text-black focus:outline-none cursor-default"
      {...register(`customFields.${fieldId}.Options.${index}`)}
      value={item}
      readOnly
    />
    <span className="cursor-pointer text-black px-2 rounded-md bg-gray-300" onClick={() => HandleDeleteOption(index, fieldId)}>x</span>
  </div>
}

// Data came from <formContainer/>
const CustomFieldForm = ({
  type,
  data,
  setOpen,
  relatedData,  //--> From the Form container (if needed)
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
    control
  } = useForm<FormData>(
    {
      resolver: customFieldZodResolver(z.object({ customFields: arrayOfCustomFields })),  //--> Resolver for the empty items in array of objects
    }
  );

  const [CustomFields, setCustomFields] = useState<any>([{ fieldName: "", fieldType: "TEXT", moduleType: data, isRequired: false }])  // Old Cstom Fields
  const [loading, setLoading] = useState(true);
  const [ObjectOfOptionArr, setObjectOptionArr] = useState<{ [key: number]: string[] }>({});  // Select options array with Customfield_id as a key for seperate select inputs
  const [ObjectOfOptionTextArea, SETObjectOptionTextArea] = useState<{ [key: number]: string }>({});  // Text area for select input with Customfield_id as a key for seperate select inputs

  const [isAdd, setIsAdd] = useState(false)   // For new Custom field


  // Delete perticular option in select list
  const HandleDeleteOption = (id: number, fieldId: number) => {
    console.log("DELETION : ", id, fieldId, `customFields.${fieldId}.Options.${id}`);
    unregister(`customFields.${fieldId}.Options.${id}`);  // Unregister the deleted option
    setObjectOptionArr((prevOptionArr) => {
      const updatedArr = Array.isArray(prevOptionArr[fieldId]) ?
        prevOptionArr[fieldId].filter((_, index) => index !== id) : [];

      // Re-register remaining options to ensure the form data is correctly synced
      updatedArr.forEach((_, index) => {
        unregister(`customFields.${fieldId}.Options.${index}`);
        register(`customFields.${fieldId}.Options.${index}`); // Re-register after deletion
      });

      // Unregister the last item to prevent repetition
      if (updatedArr.length > 0) {
        unregister(`customFields.${fieldId}.Options.${updatedArr.length}`); // Unregister the last item
      }

      return {
        ...prevOptionArr,
        [fieldId]: updatedArr // Return the updated options array for the specific fieldId
      };
    });
  };

  // New Custom Field Toggle
  const handleToggleAdd = () => {
    if (isAdd) {
      unregister(`customFields.0.fieldName`); // Unregister the field when closing
    }
    setIsAdd(!isAdd);
  };

  // Key hit in the textarea for adding the options in the select box list
  const HandleKeyDown = (e: any, fieldId: number) => {
    console.log(e.key);
    if (e.key === "Enter" && ObjectOfOptionTextArea[fieldId]?.trim() !== "") {
      const newOption = ObjectOfOptionTextArea[fieldId]?.trim();
      console.log("NEW", newOption);
      setObjectOptionArr((prevOptionArr: any) => {
        const existingArray = prevOptionArr[fieldId] || []; // Get existing options for the fieldId
        const updatedArr = [...existingArray, newOption]; // Add the new option to the existing array

        return {
          ...prevOptionArr, // Keep the previous state
          [fieldId]: updatedArr // Update the specific fieldId with the new options array
        };
      });
      SETObjectOptionTextArea((prevObj: any) => ({
        ...prevObj,
        [fieldId]: "" // Clear the text area for the specific fieldId
      }));
    }
  };


  useEffect(() => {
    if (data) {
      setLoading(true);
      getAllPermenentCustomFields(data)  //data is module type here
        .then((res) => {
          console.log("RES ", res)
          setCustomFields(res);
          // Set isSelectOpen based on the fieldType of each item
          const initialSelectOpenState = res.reduce((acc: { [key: number]: boolean }, item: any) => {
            acc[item.id] = item.fieldType === "SELECT"; // Set true if fieldType is SELECT
            return acc;
          }, {});
          setSelectOpen(initialSelectOpenState); // Update the state

          // Populate ObjectOfOptionArr with existing options
          const optionsMap: { [key: number]: string[] } = {};
          res.forEach((item: any) => {
            if (item.Options && Array.isArray(item.Options)) {
              optionsMap[item.id] = item.Options; // Set existing options for each fieldId
            }
          });
          setObjectOptionArr(optionsMap); // Update the state with existing options

          setLoading(false);
        })
        .catch((e) => {
          // console.log("Error fetching related data:", e);
          setLoading(false);
        });
    }
  }, [data]);  // Only run when `data` changes


  const AllowdType = ["TEXT", "INT", "DATE", "SELECT", "FILE"]

  const handleDeleteCustom = (id: any) => {
    deleteCustomField(id).then(() => toast.success("Deleted")).catch((e) => toast.error("Something went wrong"))
    router.refresh()
  }

  const [state, formAction] = useFormState(
    type === "create" ? createCustom : updateCustom,
    {
      success: false,
      error: false,
    }
  );


  const onSubmit = handleSubmit((data) => {
    formAction(data);

  });

  const router = useRouter();


  useEffect(() => {
    if (state.success) {
      toast.success(`Custom field has been updated "} `);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const [isSelectOpen, setSelectOpen] = useState<{ [key: number]: boolean }>({});


  // Perticular id's input fields will be change for type "SELECT"
  const handleSelectChange = (e: any, id: number) => {
    setSelectOpen((prev) => ({
      ...prev,
      [id]: e.target.value === "SELECT",
    }));
  };

  if (errors) {
    console.log("ERROR:", errors)
  }


  const HandleTextAreaChange = (e: any, fieldId: any) => {
    const value = e.target.value.trim(); // Trim the input value
    SETObjectOptionTextArea((prevObject: any) => ({
      ...prevObject,
      [fieldId]: value // Update the specific fieldId with the new value
    }));
  };


  return (
    <form className="flex flex-col gap-8 max-h-[80vh]  overflow-auto" onSubmit={onSubmit}>


      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Custom field" : "Update the Custom field"}
      </h1>



      <InputField
        label="Module type"
        name="moduleType"
        defaultValue={data}  //--> Student , Teacher, etc... : (Which is for the ModuleType)
        register={register}
        hidden
      />

      <div className="custom-left flex flex-wrap gap-12 justify-between">

        {
          loading ? (
            <div className="text-center">Loading...</div>
          ) : (

            // ==================================     list OF all old Custom Fields    ==================================  //

            (CustomFields.length > 0) && CustomFields?.map((item: any, key: any) => {
              // console.log("item -> " , item)
              return <div className="dataGrid w-full m-2  flex p-2 min-w-[100%] flex-col gap-8 rounded-lg border-2 border-gray-800 bg-[#e2e8f0] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  ">


              <li className="list-none flex  gap-2 w-[100%] justify-between gap-8 items-center">

                <input type="text"
                  className="w-1/6 bg-transparent "
                  defaultValue={item?.id}
                  {...register(`customFields.${item?.id}.id` as const)}
                  hidden

                />


                {/* {item.fieldName} */}

                <div className="input-container w-full">
                  <input
                    type="text"
                    {...register(`customFields.${item?.id}.fieldName` as const)}

                    defaultValue={item?.fieldName}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md w-full bg-slate-100"
                  />

                  <p>
                    {
                      errors[`customFields.e${item.id}` as keyof FormData] && (
                        <span className="text-xs text-red-500 mt-2">
                          {errors[`customFields.e${item.id}` as keyof FormData]?.message}

                        </span>
                      )

                    }
                  </p>
                </div>




                <Controller
                  name={`customFields.${item?.id}.isRequired` as const}
                  control={control}
                  defaultValue={item?.isRequired}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked); // Update the form state
                      }}
                    />
                  )}
                />



                <Controller
                  name={`customFields.${item?.id}.fieldType` as const}
                  control={control}
                  defaultValue={item?.fieldType} // Set the default value
                  render={({ field }) => (
                    <select
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                      {...field} // Spread the field props
                      onChange={(e) => {
                        field.onChange(e); // Call the onChange method from field
                        handleSelectChange(e, item?.id); // Call your custom handler
                      }}
                    >
                      {AllowdType.map((t) => (
                        <option value={t} key={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}
                />






                <div className="hover:cursor-pointer flex gap-4">

                  <MdDelete className="text-red-400 text-2xl " onClick={() => handleDeleteCustom(item.id)} />
                </div>
              </li>
              {
                isSelectOpen[item?.id] &&
                <>  <div className="flex flex-wrap my-2 justify-start rounded-lg min-h-20   border-gray-800  ">
                  {
                    ObjectOfOptionArr[item?.id]?.length > 0 && ObjectOfOptionArr[item?.id]?.map((optionItem: any, index: any) => {
                      return (
                        <div className="w-fit p-1" key={index}>
                          <OneOption
                            register={register}
                            index={index}
                            item={optionItem}
                            HandleDeleteOption={HandleDeleteOption}
                            fieldId={item?.id} // Pass fieldId here
                          />
                        </div>
                      );
                    })
                  }
                </div>

                  {/* <textarea  {...register("Options.0")} id="select-box" className="rounded-md w-full border-2 border-gray-500 p-2" placeholder="Enter Options Comma seperated..."></textarea> */}



                  <textarea name="option" id="option" onKeyUp={(e) => HandleKeyDown(e, item?.id)}
                    className="self-center max-h-10 p-[0.25rem] resize-none border-2 rounded-md border-gray-300 text-center " placeholder="Enter Options"
                    onChange={(e) => HandleTextAreaChange(e, item?.id)}
                    value={ObjectOfOptionTextArea[item?.id] || ""}
                    rows={1}
                  ></textarea>
                </>
              }


            </div>
            })
          )
        }

      </div>


      {/* // ==================================     New  Custom Field    ==================================  // */}

      <div className="New-Field-box flex justify-center w-full items-center gap-2 ">


        {
          isAdd ? <div className="customfield-row p-2 w-full rounded-lg border-2 transition-all duration-500 border-gray-300 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className="flex justify-between flex-wrap gap-4">

              {/* Fieldname */}
              <InputField
                label="Field name"
                name={`customFields.${0}.fieldName`}
                defaultValue={data?.fieldName}
                register={register}
              />

              {/* Type of field  */}
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Type</label>
                <select
                  onInput={(e) => handleSelectChange(e, 0)}
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register(`customFields.${0}.fieldType`)}
                >
                  {AllowdType.map((t) => (
                    <option value={t} key={t}
                    >
                      {t}
                    </option>
                  ))}
                </select>

              </div>

              {/* Is required */}
              <InputField
                label="is Required "

                name={`customFields.${0}.isRequired`}

                register={register}

                type="checkbox"

              />

              {/* Delete this field */}
              <MdDelete className="text-red-400 text-2xl cursor-pointer " onClick={() => handleToggleAdd()} />




            </div>
            <p>
              {
                errors[`customFields.e${0}` as keyof FormData] && (
                  <span className="text-xs text-red-500 mt-2">
                    {errors[`customFields.e${0}` as keyof FormData]?.message}

                  </span>
                )

              }
            </p>

            {/* If the new customfield type is set to "Select" */}
            {
              isSelectOpen[0] &&
              <>  <div className="flex flex-wrap my-2 justify-start rounded-lg min-h-20   ">
                {
                  ObjectOfOptionArr[0]?.length > 0 && ObjectOfOptionArr[0]?.map((item: any, index: any) => {
                    // console.log("item =", item)
                    return (
                      <div className="  p-1" key={index}>
                        <OneOption register={register} index={index} item={item} HandleDeleteOption={HandleDeleteOption} fieldId={0} />
                      </div>
                    );
                  })
                }
              </div>


                <textarea
                  name="option"
                  id="option"
                  onKeyUp={(e) => HandleKeyDown(e, 0)}
                  className="self-center max-h-10 p-[0.25rem] resize-none border-2 rounded-md border-gray-300"
                  placeholder="Enter Options"
                  onChange={(e) => HandleTextAreaChange(e, 0)}
                  value={ObjectOfOptionTextArea[0] || ""}
                ></textarea>
              </>
            }
          </div>

            : <div className="customfield-row p-2 w-full"></div>
        }


      </div>


      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      {/* Add new customfield button */}
      {
        !isAdd ?

          <button type='button' className="darkyellow  text-black text-center bg-amber-400 text-white p-2 w-fit  self-center rounded-md px-8" onClick={() => handleToggleAdd()}>
            {
              !isAdd ? <div className="px-4 ">+</div> : <></>
            }
          </button>
          : <>
          </>

      }
      <button className="bg-green-500 text-white p-2 rounded-md">
        {/* {type === "create" ? "Create" : "Update"} */}
        {isAdd ? "UPDATE" : "ADD"}
      </button>
    </form>
  );
};
export default CustomFieldForm;