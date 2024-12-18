// CHANGED FETCHENTRY LOGIC , removed user id from params


import { error } from "console";

import { Controller } from "react-hook-form";

const CustomComponent = ({
  Information,
  control,
  errors,
  oldData
}: {
  Information: any;
  control: any;
  errors: any;
  oldData: any;

}) => {




  // IF OLD DATA Then Fetch Entry According to the Customfield ID

  const OldUpdate = oldData?.filter((item: any) => item.CustomFieldId === Information.id)

  let CurrentData: any;
  if (OldUpdate?.length > 0) {
    CurrentData = OldUpdate[0]
  }



  // Dynamic field rendering based on type
  switch (Information.fieldType) {
    case "TEXT":

      return (
        <div className="flex flex-col items-start m-4 w-1/4   ">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="text">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}




          </label>
          <Controller
            name={`Entries.${Information.id}.FieldValue`}
            control={control}
            defaultValue={CurrentData?.FieldValue}

            render={({ field }) => (
              <input
                type="text"
                className=" ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                id="text"
                {...field}

              //required={Information?.isRequired}

              />
            )}
          />



          <Controller
            name={`Entries.${Information.id}.isRequired`}
            control={control}
            defaultValue={Information?.isRequired}
            render={({ field }) => <input {...field} hidden />}
          />

          {CurrentData?.id !== undefined && (
            <Controller
              name={`Entries.${Information.id}.id`}
              control={control}
              defaultValue={CurrentData.id}
              render={({ field }) => <input {...field} hidden />}
            />
          )}
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden
            />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }

        </div>
      );

    case "INT":

      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="number">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}


            <span className=" text-gray text-xs">
              {CurrentData?.FieldValue}
            </span>


          </label>
          <Controller
            name={`Entries.${Information.id}.FieldValue`}
            control={control}
            defaultValue={Number(CurrentData?.FieldValue) || 0}
            render={({ field }) => (
              <input
                type="number"
                className="C ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                id="number"
                {...field}


              />
            )}
          />
          <Controller
            name={`Entries.${Information.id}.isRequired`}
            control={control}
            defaultValue={Information?.isRequired}
            render={({ field }) => <input {...field} hidden />}
          />

          {CurrentData?.id !== undefined && (
            <Controller
              name={`Entries.${Information.id}.id`}
              control={control}
              defaultValue={CurrentData.id}
              render={({ field }) => <input {...field} hidden />}
            />
          )}
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }
        </div>
      );

    case "DATE":
      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="date">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}





          </label>
          <Controller
            name={`Entries.${Information.id}.FieldValue`}
            control={control}
            defaultValue={CurrentData?.FieldValue}

            render={({ field }) => (
              <input
                type="date"
                className="C ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                id="date"
                {...field}
              //required={Information?.isRequired}


              />
            )}
          />
          <Controller
            name={`Entries.${Information.id}.isRequired`}
            control={control}
            defaultValue={Information?.isRequired}
            render={({ field }) => <input {...field} hidden />}
          />
          {CurrentData?.id !== undefined && (
            <Controller
              name={`Entries.${Information.id}.id`}
              control={control}
              defaultValue={CurrentData.id}
              render={({ field }) => <input {...field} hidden />}
            />
          )}
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }
        </div>
      );

    case "BOOLEAN":
      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="checkbox">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}





          </label>
          <Controller
            name={`Entries.${Information.id}.FieldValue`}
            control={control}

            render={({ field }) => (
              <input
                type="checkbox"
                className="C ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                id="checkbox"
                {...field}
                defaultValue={CurrentData?.FieldValue}
              //required={Information?.isRequired}

              />
            )}
          />
          <Controller
            name={`Entries.${Information.id}.isRequired`}
            control={control}
            defaultValue={Information?.isRequired}
            render={({ field }) => <input {...field} hidden />}
          />
          {CurrentData?.id !== undefined && (
            <Controller
              name={`Entries.${Information.id}.id`}
              control={control}
              defaultValue={CurrentData.id}
              render={({ field }) => <input {...field} hidden />}
            />
          )}
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }
        </div>
      );

    case "SELECT":
      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="select">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}





          </label>
          <Controller

            name={`Entries.${Information.id}.FieldValue`}
            control={control}
            defaultValue={CurrentData?.FieldValue}

            render={({ field }) => (
              <select {...field} id="select-box" className=" ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              // defaultValue={CurrentData?.FieldValue}
              //required={Information?.isRequired}

              >
                <Controller
                  name={`Entries.${Information.id}.isRequired`}
                  control={control}
                  defaultValue={Information?.isRequired}
                  render={({ field }) => <input {...field} hidden />}
                />
                {CurrentData?.id !== undefined && (
                  <Controller
                    name={`Entries.${Information.id}.id`}
                    control={control}
                    defaultValue={CurrentData.id}
                    render={({ field }) => <input {...field} hidden />}
                  />
                )}
                <option value="">SELECT</option>
                {Information?.Options?.map((item: any, key: any) => (
                  <option key={key} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          />
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }
        </div>
      );

    case "FILE":
      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <label className="text-xs text-gray-500 flex gap-1 mb-2" htmlFor="file">
            {Information.fieldName}
            {(Information.isRequired === true) && (
              <span className=" text-[#ff0000]">
                *
              </span>
            )}





          </label>
          <Controller
            name={`Entries.${Information.id}.FieldValue`}
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="C ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                id="file"
                defaultValue={CurrentData?.FieldValue || ""}
                //required={Information?.isRequired}
                disabled
                {...field}
              />
            )}
          />
          <Controller
            name={`Entries.${Information.id}.isRequired`}
            control={control}
            defaultValue={Information?.isRequired}
            render={({ field }) => <input {...field} hidden />}
          />
          {CurrentData?.id !== undefined && (
            <Controller
              name={`Entries.${Information.id}.id`}
              control={control}
              defaultValue={CurrentData.id}
              render={({ field }) => <input {...field} hidden />}
            />
          )}
          <Controller
            name={`Entries.${Information.id}.CustomFieldId`}
            control={control}
            defaultValue={Information?.id}
            render={({ field }) => <input {...field} hidden />}
          />
          {
            errors[`Entries.e${Information.id}`] && (
              <span className="text-xs text-red-500 mt-2">
                {errors[`Entries.e${Information.id}`]?.message}

              </span>
            )
          }
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-start m-4 w-1/4">
          <p>{Information.fieldName} - {Information.fieldType}</p>
        </div>
      );
  }
};

export default CustomComponent;
