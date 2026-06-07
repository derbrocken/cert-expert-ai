import type { TallyWebhookField, TallyWebhookPayload } from "@/lib/tally-intake-service";
import { questionIdFromFieldKey } from "@/lib/tally-intake-config";

interface TallyApiQuestionField {
  uuid: string;
  title?: string;
}

interface TallyApiQuestion {
  id: string;
  type: string;
  title?: string | null;
  fields?: TallyApiQuestionField[];
}

interface TallyApiResponse {
  questionId: string;
  answer: unknown;
}

interface TallyApiSubmission {
  id: string;
  formId: string;
  responses: TallyApiResponse[];
}

/** Convert Tally REST submission + questions into webhook-shaped payload (replay / tests). */
export function submissionToWebhookPayload(
  submission: TallyApiSubmission,
  questions: TallyApiQuestion[],
  responseId?: string,
): TallyWebhookPayload {
  const questionById = new Map(questions.map((q) => [q.id, q]));

  const fields: TallyWebhookField[] = submission.responses.map((response) => {
    const question = questionById.get(response.questionId);
    const uuid = question?.fields?.[0]?.uuid ?? response.questionId;
    const key = `question_${response.questionId}_${uuid}`;
    return {
      key,
      label: question?.title ?? question?.fields?.[0]?.title ?? "",
      type: question?.type ?? "UNKNOWN",
      value: response.answer,
    };
  });

  return {
    eventType: "FORM_RESPONSE",
    data: {
      responseId: responseId ?? submission.id,
      submissionId: submission.id,
      formId: submission.formId,
      fields,
    },
  };
}

export function fieldQuestionId(field: TallyWebhookField): string | null {
  return questionIdFromFieldKey(field.key);
}
