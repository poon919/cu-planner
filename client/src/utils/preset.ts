export const parseProgram = (program: string) => {
  switch (program) {
    case 'S':
      return 'Semester'
    case 'T':
      return 'Trimester'
    case 'I':
      return 'Inter-Semester'
    default:
      return ''
  }
}

export const parseSemester = (program: string, semester: string) => {
  switch (program) {
    case 'I':
    case 'S':
      switch (semester) {
        case '1':
          return 'First'
        case '2':
          return 'Second'
        case '3':
          return 'Summer'
        default:
          return ''
      }
    case 'T':
      switch (semester) {
        case '1':
          return 'First'
        case '2':
          return 'Second'
        case '3':
          return 'Third'
        default:
          return ''
      }
    default:
      return ''
  }
}
