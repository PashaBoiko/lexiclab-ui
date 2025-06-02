import { computed, ref, Ref } from "vue";
import { IQuestion } from "../../types";
import { questionKey } from "../quizState.ts";

interface IPropsType {
  question: IQuestion;
}

interface IQuestionBasePayload {
  props: IPropsType;
  emit: (event: "answerQuestion" | "skipQuestion", ...args: any[]) => void;
}

export default function useQuestionBase({ props, emit }: IQuestionBasePayload) {
  const answer: Ref<string> = ref<string>("");

  const questionText = computed(() => {
    return props.question[questionKey.value];
  });

  const isAnswerAvailable = computed(() => !answer.value);

  const answerQuestion = () => {
    emit("answerQuestion", answer.value);
    answer.value = "";
  };

  const skipQuestion = () => {
    emit("skipQuestion");
    answer.value = "";
  };

  return {
    answer,
    questionText,
    isAnswerAvailable,
    answerQuestion,
    skipQuestion,
  };
}
