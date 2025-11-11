<?php

namespace App\Http\Controllers;

use App\Models\QueueVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueVideoController extends Controller
{
    // ✅ Upload new video
    public function store(Request $request)
    {
        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi,webm|max:204800',
        ]);

        $queueVideo = QueueVideo::create([
            'title' => $request->input('title', 'Playback Video'),
            'display' => $request->boolean('display', false),
        ]);

        $queueVideo->addMediaFromRequest('video')
            ->toMediaCollection('videos');

        return redirect()->back()->with('success', 'Video uploaded successfully.');
    }

    // ✅ Toggle Display ON/OFF
    public function updateDisplay(Request $request, QueueVideo $queueVideo)
    {
        $queueVideo->update([
            'display' => $request->boolean('display'),
        ]);

        return redirect()->back()->with('success', 'Display status updated.');
    }

    // ✅ Queue Display Page (TV screen)
    public function queuePage()
    {
        $videos = QueueVideo::where('display', true)
            ->with('media')
            ->get()
            ->map(fn($video) => [
                'id' => $video->id,
                'title' => $video->title,
                'url' => $video->getFirstMediaUrl('videos'),
            ]);

        return Inertia::render('Queue', [
            'videos' => $videos,
        ]);
    }

    // ✅ Video Management Page
    public function selectPage(): \Inertia\Response
    {
        $videos = QueueVideo::with('media')
            ->get()
            ->map(fn($video) => [
                'id' => $video->id,
                'title' => $video->title,
                'url' => $video->getFirstMediaUrl('videos'),
                'display' => $video->display,
            ]);
        return Inertia::render('VideoSelect', [
            'videos' => $videos,
        ]);
    }
}
