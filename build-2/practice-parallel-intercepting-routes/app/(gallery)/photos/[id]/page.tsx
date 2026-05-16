export default async function Photo({ params }: {params: Promise<{ id: string }>}) {
    const p = await params
    return <img src={`/images/${p.id}.png`} width={100} />
}