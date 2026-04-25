from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

QuestionType = Literal["ONE", "MORE", "JUDGE"]


class QuizOption(BaseModel):
    id: str = Field(min_length=1)
    text: str = Field(min_length=1)


class QuizQuestion(BaseModel):
    id: str = Field(min_length=1)
    type: QuestionType
    stem: str = Field(min_length=1)
    options: List[QuizOption] = Field(min_length=2)
    correctAnswerIds: List[str] = Field(min_length=1)
    score: Optional[float] = Field(default=None, gt=0)

    @field_validator("correctAnswerIds")
    @classmethod
    def validate_answer_ids(cls, value: List[str]) -> List[str]:
        normalized = [str(item).strip() for item in value if str(item).strip()]
        if not normalized:
            raise ValueError("correctAnswerIds cannot be empty")
        return list(dict.fromkeys(normalized))

    @field_validator("type")
    @classmethod
    def ensure_known_type(cls, value: str) -> str:
        allowed = {"ONE", "MORE", "JUDGE"}
        if value not in allowed:
            raise ValueError(f"unsupported question type: {value}")
        return value


class ParseQuestionsResponse(BaseModel):
    quizTitle: str
    questions: List[QuizQuestion] = Field(min_length=1)
