import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginateProps {
    meta: {
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    } | null;
    current: number;
    lastPage: number;
    from: number;
}

const Paginate: React.FC<PaginateProps> = ({ meta, current, lastPage, from }) => {
    if (!meta) {
        return <p className="text-gray-500 text-sm">No pagination data available.</p>;
    }

    const links = meta.links ?? [];

    const pages = links.slice(1, -1).map((link, i) => {
        const linkClassName = link.active
            ? 'border-rose-500 px-4 pt-4 text-sm font-medium text-rose-600'
            : 'border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700';

        return link.url ? (
            <Link
                preserveScroll
                key={i}
                href={link.url}
                className={`inline-flex items-center border-t-2 ${linkClassName}`}
            >
                {link.label}
            </Link>
        ) : (
            <span
                key={i}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
            >
                {link.label}
            </span>
        );
    });

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                <Link
                    preserveScroll
                    href={links[0]?.url ?? '#'}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: links[0]?.label ?? '' }}
                />
            </div>
            <div className="hidden md:-mt-px md:flex">{pages}</div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <Link
                    preserveScroll
                    href={links[links.length - 1]?.url ?? '#'}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: links[links.length - 1]?.label ?? '' }}
                />
            </div>
        </nav>
    );
};
export default Paginate;
