import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';

function TemporaryFieldUpdate({
    Information,
    setTempFields,
    index,
    unregister
}: {
    Information: any,
    setTempFields: any,
    index: any,
    unregister: any
}) {

    const [fieldData, setFieldData] = useState<{ [key: number]: { fieldName: string, fieldType: string, isRequired: boolean, Options: string[] } }>({
        [index]: {
            fieldName: Information?.fieldName || '',
            fieldType: Information?.fieldType || '',
            isRequired: Information?.isRequired || false,
            Options: Information?.Options || []
        }
    });

    const [newOption, setNewOption] = useState<string>('');

    const AllowedTypes = ["TEXT", "INT", "DATE", "SELECT", "FILE"];
    const handleIsRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldData(prev => {
            const updated = { ...prev };
            updated[index] = {
                ...updated[index],
                isRequired: e.target.checked
            };
            return updated;
        });

        // Update tempFields directly to reflect the change
        setTempFields((prev: any) => {
            const updatedFields = [...prev];
            updatedFields[index] = {
                ...updatedFields[index],
                isRequired: e.target.checked
            };
            return updatedFields;
        });
    };
    const handleAddOption = () => {
        if (newOption.trim() !== '') {
            setFieldData(prev => {
                const updated = { ...prev };
                updated[index] = {
                    ...updated[index],
                    Options: [...updated[index].Options, newOption]
                };
                return updated;
            });
            setNewOption('');
            setTempFields((prev: any) => {
                const updatedFields = [...prev];
                updatedFields[index] = { ...updatedFields[index], Options: [...updatedFields[index].Options, newOption] };
                return updatedFields;
            });
        }
    };

    const handleDeleteField = (fieldId: string) => {
        setTempFields((prevFields: any) =>
            prevFields.map((field: any) => {
                if (field.id === fieldId) {

                    unregister(`Entries.${fieldId}.isRequired`); // Unregister if not required


                    return { ...field, isDeleted: true }; // Mark the field as deleted instead of removing it
                }
                return field;
            })
        );
    };

    const handleDeleteOption = (optionIndex: number) => {
        setFieldData(prev => {
            const updated = { ...prev };
            updated[index] = {
                ...updated[index],
                Options: updated[index].Options.filter((_, idx) => idx !== optionIndex)
            };
            return updated;
        });
        setTempFields((prev: any) => {
            const updatedFields = [...prev];
            updatedFields[index] = {
                ...updatedFields[index],
                Options: updatedFields[index].Options.filter((_: any, idx: any) => idx !== optionIndex)
            };
            return updatedFields;
        });
    };

    useEffect(() => {
        setFieldData(prev => {
            const updated = { ...prev };
            updated[index] = {
                fieldName: Information?.fieldName || '',
                fieldType: Information?.fieldType || '',
                isRequired: Information?.isRequired || false,
                Options: Information?.Options || []
            };
            return updated;
        });
    }, [Information, index]);

    return (
        <div className={`w-full flex flex-col justify-between gap-2 transition-all duration-300 ${Information.isDeleted ? "opacity-10  " : "bg-[#e2e8f0] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"}  border-2 transition-all duration-300 border-gray-700 items-center w-full border-4 rounded-lg p-4`}>
   
            <div className={`w-full flex justify-between gap-2 items-center mx-10 m-12 w-full`}>
                <input
                    type="text"
                    value={fieldData[index]?.fieldName || ''}
                    className={` ${Information?.isDeleted && "text-gray-400 " }  ring-[1.5px] ring-gray-300 p-2 rounded-md`}
                    onChange={(e) => {
                        setFieldData(prev => {
                            const updated = { ...prev };
                            updated[index] = {
                                ...updated[index],
                                fieldName: e.target.value
                            };
                            return updated;
                        });
                        setTempFields((prev: any) => {
                            const updatedFields = [...prev];
                            updatedFields[index] = { ...updatedFields[index], fieldName: e.target.value };
                            return updatedFields;
                        });
                    }}
                    disabled={Information.isDeleted}
                />
                <select
                    disabled={Information.isDeleted}

                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    onChange={(e) => {
                        setFieldData(prev => {
                            const updated = { ...prev };
                            updated[index] = {
                                ...updated[index],
                                fieldType: e.target.value
                            };
                            return updated;
                        });
                        setTempFields((prev: any) => {
                            const updatedFields = [...prev];
                            updatedFields[index] = { ...updatedFields[index], fieldType: e.target.value };
                            return updatedFields;
                        });
                    }}
                    value={fieldData[index]?.fieldType || ''}
                >
                    {AllowedTypes.map((t) => (
                        <option value={t} key={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <div className="isR flex gap-2">
                    <label htmlFor="">is Required?</label>
                    <input
                    disabled={Information.isDeleted}

                        type="checkbox"
                        checked={fieldData[index]?.isRequired || false}
                        onChange={handleIsRequiredChange}
                    />
                </div>

                {
                    Information.isDeleted ?  <></> : <MdDelete type='button'
                    className="text-red-400 text-2xl cursor-pointer"
                    onClick={() => handleDeleteField(Information?.id)}
                >
                    Delete Field
                </MdDelete>
                }
            </div>

            {fieldData[index]?.fieldType === "SELECT" && (
                <div className='flex flex-col w-full'>
                    <div className='flex min-w-fit flex-wrap'>
                        <div className='flex'>
                            {fieldData[index]?.Options.map((option, optionIndex) => (
                                <div key={optionIndex} className={`box p-[0.3rem] flex me-2 my-2 ${!Information.isDeleted ? "bg-sky-50" : "bg-gray-200" }  border-gray-300 flex-wrap rounded-lg w-fit gap-2 border-2`}>
                                    <span className='w-fit bg-transparent text-black'>{option}</span>
                                    <div className='cursor-pointer text-black px-2 rounded-md bg-gray-300' onClick={() => handleDeleteOption(optionIndex)}>x</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <textarea
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add option"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddOption();
                            }
                        }}
                        disabled={Information.isDeleted}


                        rows={1}
                        className="resize-none w-fit mt-4 self-center ring-[1.5px] ring-gray-300 p-2 rounded-md"
                    />
                </div>
            )}
        </div>
    );
}

export default TemporaryFieldUpdate