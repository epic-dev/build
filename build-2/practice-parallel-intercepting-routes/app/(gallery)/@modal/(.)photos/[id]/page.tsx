
'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = useParams()
    const router = useRouter()
    const ref = useRef<HTMLDialogElement>(null)
    const goBackOnClose = () => {
        router.back()
    }
    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('close', goBackOnClose)
        }
        return () => {
            ref.current?.removeEventListener('close', goBackOnClose)
        }
    }, [ref])
    return <dialog ref={ref} closedby="any" open className="open:backdrop:bg-gray-600 top-[50%] left-[50%] translate-[-50%] border border-gray-100 p-48">
        <img src={`/images/${id}.png`} width={300} />
    </dialog>
}