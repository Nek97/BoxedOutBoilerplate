export type IEachItTest = [
  string,
  {
    actionToDoBefore?: {
      async: boolean;
      action: () => void;
    };
    actionToDoAfter?: {
      async: boolean;
      action: () => void;
    };
    variables: any;
    testResult: {
      data: boolean;
      error: boolean;
      errorMessage?: string;
    };
  },
][];
