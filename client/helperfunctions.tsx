import { IMove, IPostRoutine, IStartValue, ISavedRoutines } from './interface';

function calculateRoutineStart(routine: IMove[]): IStartValue {
  const length = routine.length;
  let eScore: number = 0;

  if (length === 0) {
    eScore = 0;
  } else if (length < 3) {
    eScore = 2.0
  } else if (length < 5) {
    eScore = 4.0
  } else if (length < 7) {
    eScore = 6.0
  } else {
    eScore = 10.0
  }

  const elementTotal = round(routine.reduce((acc: number, move: IMove) => { return acc + move.pointValue }, 0), 1);


  let requirmentsTotal: number = 0;

  if (routine.some(move => move.copGroup === '1')) requirmentsTotal += 0.5;
  if (routine.some(move => move.copGroup === '2')) requirmentsTotal += 0.5;
  if (routine.some(move => move.copGroup === '3')) requirmentsTotal += 0.5;
  if (routine[routine.length - 1].pointValue === 0.3) requirmentsTotal += 0.3;
  if (routine[routine.length - 1].pointValue > 0.3) requirmentsTotal += 0.3;
  if (routine[0].apparatus === 'Floor') {
    if (!routine.some(move => move.isDoubleRotation === true)) {
      requirmentsTotal -= 0.3;
    }
  }

  const totalStartValue = round((eScore + requirmentsTotal + elementTotal), 1);

  return { eScore: eScore.toFixed(1), requirmentsTotal: requirmentsTotal.toFixed(1), elementTotal: elementTotal.toFixed(1), totalStartValue: totalStartValue.toFixed(1) }
}

function calculateVaultStart(routine: IMove[]): IStartValue[] {
  let firstStart: IStartValue = { eScore: '10.0', requirmentsTotal: '0.0', elementTotal: `${routine[0].pointValue}`, totalStartValue: (routine[0].pointValue + 10).toFixed(1) }
  if (routine.length === 1) {
    return [firstStart, { eScore: '10.0', requirmentsTotal: '0.0', elementTotal: '0.0', totalStartValue: '0.0' }]
  }
  return [firstStart, { eScore: '10.0', requirmentsTotal: '0.0', elementTotal: `${routine[1].pointValue}`, totalStartValue: (routine[1].pointValue + 10).toFixed(1) }]
}

function round(value: number, precision: number): number {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function convertSavedRoutines(data: IPostRoutine[]): ISavedRoutines[] {
  const floor: IPostRoutine[] = data.filter(routine => routine.apparatus === 'Floor').sort((a: IPostRoutine, b: IPostRoutine) => {
    if (a.routineName < b.routineName) return 1;
    if (b.routineName > b.routineName) return -1;
    return 0;
  });
  // const pommel: IMove[] = data.filter(item => item.apparatus === 'floor');
  // const rings: IMove[] = data.filter(item => item.apparatus === 'floor');
  const vault: IPostRoutine[] = data.filter(routine => routine.apparatus === 'Vault').sort((a: IPostRoutine, b: IPostRoutine) => {
    if (a.routineName < b.routineName) return 1;
    if (b.routineName > b.routineName) return -1;
    return 0;
  });
  const pBars: IPostRoutine[] = data.filter(routine => routine.apparatus === 'Parallel Bars').sort((a: IPostRoutine, b: IPostRoutine) => {
    if (a.routineName < b.routineName) return 1;
    if (b.routineName > b.routineName) return -1;
    return 0;
  });
  const hBar: IPostRoutine[] = data.filter(routine => routine.apparatus === 'Horizontal Bars').sort((a: IPostRoutine, b: IPostRoutine) => {
    if (a.routineName < b.routineName) return 1;
    if (b.routineName > b.routineName) return -1;
    return 0;
  });

  return [
    {
      title: 'Floor:',
      data: floor
    },
    {
      title: 'Pommel Horse:',
      data: []
    },
    {
      title: 'Rings:',
      data: []
    },
    {
      title: 'Vault:',
      data: vault
    },
    {
      title: 'Parallel Bars:',
      data: pBars
    },
    {
      title: 'Horizontal Bars:',
      data: hBar
    },
  ]
}

export default {
  calculateRoutineStart,
  calculateVaultStart,
  convertSavedRoutines
}