import { ChevronDownIcon, ChevronUpIcon, ArrowRightCircleIcon } from '@heroicons/react/20/solid';
import {Link} from '@inertiajs/react'

type Props = {
    headers: string[];
    records: { [key: string]: string | number }[];
    filterBy?: (header: string) => void;
    currentFilter?: string;
    currentSort?: string;
    emptySpan?: string;
    currentTab?: string;
    selectedTab?: string;
    button?: Array<{
        primary: string;
        linkable: string;
        text: string;
    }>
};

const convertToHumanReadable = (str: string): string =>
    str.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
export default function Table({ headers, records, filterBy, currentFilter, currentSort, button, emptySpan, currentTab, selectedTab }: Props) {

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 overflow-y-auto h-[29.5rem]">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    scope="col"
                                    className="text-left"
                                    key={index}
                                >
                                    {
                                        button?.[0]?.primary !== header ?
                                            <button
                                                className="group inline-flex items-center text-xs font-medium uppercase tracking-wide text-gray-500 py-3 px-3"
                                                onClick={() => filterBy?.(header)}
                                            >
                                                {convertToHumanReadable(header)}
                                                {currentFilter === header && (
                                                    <span
                                                        className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                {currentSort === 'asc' ? (
                                                    <ChevronUpIcon className="h-5 w-5 text-gray-700"/>
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-700"/>
                                                )}
                                            </span>
                                                )}
                                            </button>
                                            : <></>
                                    }
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length}>
                                    <div className="py-28 text-gray-300 flex justify-center">
                                        <div>
                                            <h1 className="uppercase font-extrabold">{emptySpan ?? 'No Records'}</h1>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            records.map((record, i) => (
                                <tr key={i} className={currentTab ?? "even:bg-gray-50"}>
                                    {headers.map((header, index) => (
                                        <td
                                            key={index}
                                            className={`whitespace-nowrap text-sm font-medium py-4 px-4 ${
                                                index === 0 ? 'text-gray-900' : 'text-gray-500'
                                            }`}
                                        >
                                            <div className="flex">
                                                {
                                                    header === selectedTab ? <div>
                                                        {record[header] == currentTab ? <ArrowRightCircleIcon className="h-4.5 w-4.5 text-rose-500"/> : <></>}
                                                    </div> : <></>
                                                }
                                                {header !== button?.[0]?.primary ? (
                                                    record[header]
                                                ) : (
                                                    <Link href={route(button[0].linkable, record[header])} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    >{button[0].text}</Link>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
