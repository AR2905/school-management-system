"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  customZodResolver,
  examSchema,
  ExamSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createExam, 
  CreateNestedField, 
  createSubject,
  updateExam,
  UpdateNestedFields,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TemporaryFieldUpdate from "@/custom-field/TemporaryFieldUpdate";
import CustomComponentTemp from "@/custom-field/CustomComponentTemp";
import CustomComponent from "@/custom-field/CustomComponent";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    unregister , 
    control , 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: customZodResolver(examSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const { AllCustomFields } = relatedData;
  console.log("AllCustomFields" , relatedData)
  const AllowdType = ["TEXT", "INT", "DATE",  "SELECT", "FILE"]

  const [Create, setCreate] = useState(false)
  const [TemporaryLable, setTemporaryLable] = useState("")
  const [TemporaryRequired, setIsTemporaryRequired] = useState(false)
  const [TemporaryType, setTemporaryType] = useState("TEXT")
  const [TemporaryItems, setTemporaryItems] = useState<any[]>([])
  const [optionInput, setOptionInput] = useState("")
  const [isSelect, setSelect] = useState(false)
  const [Update, setUpdate] = useState(false)
  const [tempFields, setTempFields] = useState<any[]>([]);



  const addOption = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && optionInput.trim() !== "") {
      event.preventDefault();
      setTemporaryItems((prev) => [...prev, optionInput.trim()]);
      setOptionInput("")
    }
  };

  const resetFields = () => {
    setIsTemporaryRequired(false)
    setTemporaryType("TEXT")
    setTemporaryItems([])
    setOptionInput("")
    setSelect(false)
  }

  const removeOption = (index: number) => {
    setTemporaryItems((prev) => prev.filter((_, i) => i !== index));
  };
  const setAddNested = async () => {


    // Comma seperated

    const TrimmedOptions: any = TemporaryItems.map((item: any) => item.trim());
    setTemporaryItems(TrimmedOptions);


    const MyData = {
      fieldName: TemporaryLable.trim(),
      moduleType: "Exam",
      fieldType: TemporaryType,
      isRequired: TemporaryRequired,
      Options: TrimmedOptions,
      isTemp: true
    }


    const RESPONSE = await CreateNestedField(MyData)
    if (RESPONSE.success === true) {
      setTempFields([...tempFields, RESPONSE?.Response])

      toast.success("Temp field created")

    } else {
      toast.error("Something went wrong")

    }
    setTemporaryLable("")

    resetFields()
    // router.refresh()


  }

  const setUpdateNested = async () => {
    try {

      const invalidFields = tempFields.filter(field => !field.fieldName.trim());
      if (invalidFields.length > 0) {
        // Handle validation error, e.g., show an error message
        toast.error("Field names cannot be empty.");
        return;
      }

      const RESPONSE = await UpdateNestedFields(tempFields);




      if (RESPONSE.success) {
        if (Array.isArray(RESPONSE.updatedFields) && RESPONSE.updatedFields.length > 0) {
          setTempFields([...RESPONSE.updatedFields]);
        } else {
          setTempFields((prevFields) => prevFields); // Ensure no change if fields are empty
        }

        toast.success("Temp fields updated successfully");
      } else {
        // Optionally handle the errors if RESPONSE.errors exists
        // const errorMessages = RESPONSE.errors?.map(err => err.error).join(", ");

        toast.error(`Some fields failed to update`);
      }
    } catch (error) {
      console.error("Error updating nested fields:", error);
      toast.error("An error occurred while updating fields.");
    }

    setUpdate(false);
  };





  function SelectInputChanged(CurrentType: any) {
    setTemporaryType(CurrentType)
    if (CurrentType === "SELECT") {
      setSelect(true)
    }
    else {
      setSelect(false)
    }
  }





  const TempCustomFields = data?.Entries?.map((item: any) => {
    if (item?.customField?.isTemp === true ) {
      return item.customField;
    }
    return null;
  })
    .filter((item: any) => item !== null);


  useEffect(() => {
  }, [tempFields])
  useEffect(() => {
    if (TempCustomFields?.length > 0) {
      setTempFields([...tempFields, ...TempCustomFields])
    }
  }, [])


  const onSubmit = handleSubmit((data) => {
    const DataForEntry = data.Entries?.filter((item: any) => item.FieldValue && item.CustomFieldId);


    formAction({ ...data, Entries: DataForEntry });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData;


  
  return (
    <form className="flex flex-col gap-8 max-h-[90vh] overflow-y-scroll p-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>

      <div className="flex justify-around flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        {/* <InputField
          label="Start Date"
          name="startTime"
          defaultValue={formatDateTime(data?.startTime)}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        /> */}
        {/* <InputField
          label="End Date"
          name="endTime"
          defaultValue={formatDateTime(data?.endTime)}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        /> */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <>
        <div className="customs text-black mt-10">
          <hr />
          <p className="text-gray-600 text-center  " >Extra Information</p>
          <hr />

          <div className="custom-fields-container flex mt-4 justify-between flex-wrap gap-4">
            {AllCustomFields?.map((field: any, key: number) => (
              <CustomComponent
                key={key}
                Information={field}   //--> Each Custom Field information
                control={control}  // -->  register here 
                errors={errors}
                oldData={data?.Entries}  // --> if  " UPDATE "
              />
            ))}

          </div>


        </div>


        <div className="customs text-black mt-10">
          <hr />
          <p className="text-gray-600 text-center  " >Other Information</p>
          <hr />

          {
            !Update && <div className="custom-fields-container flex mt-4 justify-between flex-wrap gap-4">
              {

                tempFields && tempFields.length > 0 ? tempFields.filter((field: any) => !field?.isDeleted).map((field: any, key: number) => {

                  return <CustomComponentTemp
                    key={key}
                    Information={field}   //--> Each Custom Field information
                    control={control}  // -->  register here 
                    errors={errors}
                    oldData={data?.Entries}  // --> if "UPDATE"
                    unregister={unregister}
                    register={register}
                  />

                }) :
                  <div className="text-sm text-gray-300 text-center w-full">
                    No fields! Please Create
                  </div>
              }

            </div>

          }

        </div>

        <div className="create-field-box flex gap-2 flex-col items-center  justify-center  ">
          {
            Create ?
              <div className="border-2 rounded-lg border-gray-300  w-full transition-all duration-100     bg-[#e2e8f0] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ">

                <div className="create-field w-full flex justify-between items-center p-4  gap-4   ">


                  <input type="text" placeholder="Lable..." className="w-3/6 p-2 ring-[1.5px] ring-gray-300   rounded-md text-sm w-full" value={TemporaryLable} onChange={(e) => setTemporaryLable(e.target.value)} />


                  <div className="select w-2/6">
                    <select
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                      onChange={(e) => SelectInputChanged(e.target.value)}
                    >
                      {AllowdType.map((t) => (
                        <option value={t} key={t}
                        >
                          {t}
                        </option>
                      ))}
                    </select>

                  </div>



                  <div className="isRequired-box w-1/6 flex justify-center">
                    <label htmlFor="isReq">isReq</label>
                    <input type="checkbox" name="isReq" className="ms-2" id="isReq" checked={TemporaryRequired} onChange={(e) => setIsTemporaryRequired(!TemporaryRequired)} />
                  </div>

                  <div className="add-btn w-1/6 flex justify-end me-4">
                    <button type='button' className="cursor-pointer w-fit border-2 border-gray-500  bg-green-500 hover:bg-green-600 text-white p-2 rounded-md" onClick={() => setAddNested()}>Add</button>

                  </div>

                </div>

                {isSelect && (
                  <div className="flex flex-col gap-2 w-full p-4">



                    <div className="flex flex-wrap gap-2 ">
                      {TemporaryItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-200 p-2 rounded-md bg-sky-50 border-gray-300 border-2"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            className="text-black px-2 rounded-md bg-gray-200"
                            onClick={() => removeOption(index)}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>

                    <textarea

                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      placeholder="Add option"
                      onKeyDown={(e) => addOption(e)}
                      rows={1} // You can adjust the number of rows as needed
                      className="resize-none w-fit mt-4 ring-[1.5px] ring-gray-300 p-2 rounded-md" // Optional: Prevent resizing
                      autoComplete="false"
                    />
                  </div>
                )}
              </div>
              : <div className="transition-all duration-300"></div>
          }




        </div>
        <div className="field-btn flex flex gap-2  justify-start w-full">
          <button type='button' className="text-green-600 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-400  font-bolder hover:text-white border border-green-400 hover:bg-green-500  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-300 dark:text-green-300 dark:hover:text-white dark:hover:bg-green-400 dark:focus:ring-green-900" onClick={() => {
            setCreate(!Create)
            setUpdate(false)
          }}>{!Create ? "Create Field" : "Remove Field"} </button>



          <button type="button" className="text-green-600 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-400  font-bolder hover:text-white border border-green-400 hover:bg-green-500  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-300 dark:text-green-300 dark:hover:text-white dark:hover:bg-green-400 dark:focus:ring-green-900"
            onClick={() => {
              setUpdate(!Update)
              setCreate(false)
            }}>
            {!Update ? "Update Field" : "Show fields"}
          </button>
        </div>

        {
          Update &&
          <div className="flex flex-col justify-center  items-center w-full gap-8 p-4   animate-fadeIn ">
            {
              (tempFields && tempFields.length > 0) ? tempFields.map((field: any, key: number) => {
                return <TemporaryFieldUpdate
                  key={key}
                  index={key}
                  Information={field}   //--> Each Custom Field information

                  setTempFields={setTempFields} // Pass the setTempFields function to allow updates
                  unregister={unregister}
                />


              }) : <div className="text-sm text-gray-300  animate-fadeIn ">
                No fields for update! Please Create</div>
            }
          </div>
        }
        <div className="update-btn w-full flex justify-center">
          {
            Update && tempFields?.length > 0 &&
            <button type='button' className="cursor-pointer w-fit border-2 border-gray-500  bg-green-500 hover:bg-green-600 text-white p-2 rounded-md" onClick={() => setUpdateNested()}>Update</button >

          }
        </div>
      </>


      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
