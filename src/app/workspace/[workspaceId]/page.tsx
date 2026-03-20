interface Props {

    params: {

        workspaceId: string;
    }
}


const Page = async ({params}: Props) => {

    const {workspaceId} = await params;


    return (

        <div>
            ID: { workspaceId }
        </div>
    )


}

export default Page;