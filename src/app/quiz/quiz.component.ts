import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  standalone: true, 
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  imports: [CommonModule]
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex: number = 0;  
  feedbackMessage: string = '';
  showFeedback: boolean = false;
  score: number = 0;
  showResult: boolean = false;
  range: number = 100;
  isCorrect: boolean = false;
  correct: any = 0;
  selectedAnswer: any = 0;

  constructor() { }

  ngOnInit(): void {
    this.generateQuestions();
  }

  generateDivisor(number: number) {
    let divisors = [];
    for (let i = 2; i <= number-1; i++){
      if (number % i === 0) {
        divisors.push(i);
      }
    }

    if (divisors.length === 0) {
      return null;
    }

    let randomIndex = Math.floor(Math.random() * divisors.length);

    return divisors[randomIndex];
  }
  
  generateQuestions() {
    this.questions = [];
    const uniqueQuestions = new Set();

    while (this.questions.length < this.range) {
        let dividend;
        let divisor;
        do {
            dividend = Math.floor(Math.random() * this.range) + 1;
            divisor = this.generateDivisor(dividend);
        } while (divisor === null);

        const questionKey = `${dividend}/${divisor}`;
        if (!uniqueQuestions.has(questionKey)) {
            uniqueQuestions.add(questionKey);
            const correctAnswer = dividend / divisor;
            const options = this.generateOptions(correctAnswer);
            this.questions.push({ dividend, divisor, correctAnswer, options });
        }
    }
}

  generateOptions(correctAnswer: number) {
    const options = new Set<number>();
    options.add(correctAnswer);
    while (options.size < 4) {
      options.add(Math.floor(Math.random() * (correctAnswer + 4)) + 1);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  checkAnswer(selectedAnswer: number) {
    this.selectedAnswer = selectedAnswer;
    this.correct = this.questions[this.currentQuestionIndex].correctAnswer;
    if (selectedAnswer === this.correct) {
      this.score++;
      this.isCorrect = true;
    } else {
      this.isCorrect = false
    }

    this.showFeedback = true;
    setTimeout(() => {
      this.showFeedback = false;
    }, 3000);

    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult = true;
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.generateQuestions();
  }

  setRange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const range = Number(target.value);
    this.range = range;
    this.resetQuiz();
  }  
}
