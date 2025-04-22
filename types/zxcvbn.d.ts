declare module 'zxcvbn' {
    export interface ZXCVBNResult {
      score: 0 | 1 | 2 | 3 | 4
      feedback: {
        suggestions: string[]
        warning: string
      }
      guesses: number
      guesses_log10: number
      crack_times_display: Record<string, string>
      crack_times_seconds: Record<string, number>
      password: string
    }
  
    function zxcvbn(password: string): ZXCVBNResult
    export = zxcvbn
  }
  