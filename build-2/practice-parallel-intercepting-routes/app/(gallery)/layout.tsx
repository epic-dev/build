export default function Layout({
    modal,
    info,
    children,
}: Readonly<{
    modal: React.ReactNode;
    info: React.ReactNode;
    children: React.ReactNode;
}>) {
    return <>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16 }}>
            <main>{children}</main>
            <aside>{info}</aside>
            {modal}
        </div>
    </>
}