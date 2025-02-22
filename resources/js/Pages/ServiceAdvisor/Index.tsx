import React from 'react'

export default function IndexPage(pages: any){
    console.log(pages);
    return <>
        <table>
            <thead className="border">
                <th>Queue ID</th>
                <th>Plate</th>
                <th>Date Time</th>
                <th>Action</th>
            </thead>
        </table>
    </>
}
