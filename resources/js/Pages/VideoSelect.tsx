import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

interface Video {
    id: number;
    title: string;
    url: string;
    display: boolean;
}

interface PageProps {
    auth: {
        user: any;
        role: string[];
    };
    videos: Video[];
}

export default function VideoSelect({ auth, videos }: PageProps) {
    const { data, setData, post, progress, reset, errors } = useForm({
        title: '',
        video: null as File | null,
        display: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('queue-video.store'), {
            forceFormData: true,
            onSuccess: () => reset(), // reset form after upload
            preserveScroll: true,
        });
    };

    const toggleDisplay = (id: number, currentDisplay: boolean) => {
        router.patch(route('queue-video.update-display', id), {
            data: { display: !currentDisplay },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Video Management</h2>}
        >
            <Head title="Video Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-10">

                    {/* ✅ Upload Video Form */}
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setData('video', e.target.files ? e.target.files[0] : null)}
                                    className="w-full"
                                    required
                                />
                                {errors.video && <div className="text-red-500 text-sm">{errors.video}</div>}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.display}
                                    onChange={(e) => setData('display', e.target.checked)}
                                />
                                <label className="text-gray-700 dark:text-gray-300 text-sm">Display Immediately</label>
                            </div>

                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-red-600 h-2.5 rounded-full"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Upload Video
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ✅ Videos Grid */}
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {videos.map((video) => (
                                <div key={video.id} className="bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                                    <video controls className="w-full h-48 object-cover bg-black">
                                        <source src={video.url} type="video/mp4" />
                                    </video>

                                    <div className="p-4 flex flex-col items-center">
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{video.title}</h2>

                                        <button
                                            onClick={() => toggleDisplay(video.id, video.display)}
                                            className={`px-4 py-2 text-sm rounded-full font-semibold ${
                                                video.display
                                                    ? "bg-red-600 text-white hover:bg-red-700"
                                                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                            }`}
                                        >
                                            {video.display ? "Displayed" : "Not Displayed"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
