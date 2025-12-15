import {LearningPage} from "@/components/student/courses/LearningPage";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = (props: Props) => {
    return <LearningPage params={props.params}/>;
};
export default Page
