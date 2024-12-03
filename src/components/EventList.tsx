import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  if(data?.length === 0 ) {
    return <div className="text-gray-500 text-center ">
        No events scheduled for  {date.toLocaleDateString()}  ...
    </div>
  }else{

    return data.map((event) => (
      <div
        className="p-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
        key={event.id}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-600">{event.title} </h1>
          <span className="text-gray-300 text-xs">
            {event.startTime.toLocaleTimeString("en-UK", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
        <p className="mt-2 text-gray-400 text-sm">{event.description} - class {event.classId}</p>
      </div>
    ));
  }

};

export default EventList;
