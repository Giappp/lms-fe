import {QuestionType} from "@/types/enum";
import {Badge} from "@/components/ui/badge";

const QuestionTypeBadge = ({type}: { type: QuestionType }) => {
    const config = {
        MULTIPLE_CHOICE: {label: 'Multiple Choice', color: 'bg-primary/10 text-primary border-primary/20'},
        SINGLE_CHOICE: {label: 'Single Choice', color: 'bg-chart-2/10 text-chart-2 border-chart-2/20'},
        TRUE_FALSE: {label: 'True/False', color: 'bg-secondary/10 text-secondary border-secondary/20'}
    };

    const typeConfig = config[type] || config.SINGLE_CHOICE;

    return (
        <Badge variant="outline" className={`${typeConfig.color} border`}>
            {typeConfig.label}
        </Badge>
    );
};

export default QuestionTypeBadge;