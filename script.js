function getSquareMetersCost(squareMeters, isWetArea) {
  if (isWetArea) {
    return 65 * squareMeters;
  }

  let multiplier;
  if (squareMeters < 25) {
    multiplier = 50;
  } else if (squareMeters > 40) {
    multiplier = 50;
  } else {
    multiplier = 40;
  }

  return squareMeters * multiplier;
}

function estimateCost(
  squareMeters,
  complexity,
  numberOfVisits,
  isWetArea,
  isProject,
) {
  const squareMetersCost = getSquareMetersCost(squareMeters, isWetArea);

  console.log("R$: ", squareMetersCost.toFixed(2));

  if (!isProject) {
    return squareMetersCost;
  }

  const complexityPerSquareMeter = {
    low: 7.33,
    medium: 8.39,
    high: 9.61,
    special: 11,
  };

  if (!complexityPerSquareMeter[complexity]) {
    console.error("Invalid complexity. Use 'low', 'medium', or 'high'.");
    return;
  }

  const visitsCost = 60 * 2 * numberOfVisits;

  const operationalCosts = visitsCost + 240 + 160 + 100 + 150;

  const totalCost =
    squareMetersCost +
    squareMetersCost * (1.5 + complexityPerSquareMeter[complexity] / 100) +
    operationalCosts;

  return totalCost;
}

document.getElementById('cost-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const projectType = document.getElementById('projectType').value;
  const squareMeters = parseFloat(document.getElementById('squareMeters').value);
  const complexity = document.getElementById('complexity').value.toLowerCase();
  const numberOfVisits = parseInt(document.getElementById('numberOfVisits').value);
  const isWetArea = parseInt(document.getElementById('isWetArea').value);

  console.log(projectType);
  const isProject = projectType === 'project';

  const totalCost = estimateCost(squareMeters, complexity, numberOfVisits, isWetArea, isProject);

  document.getElementById('result').innerText = `The project cost estimate is: $${totalCost.toFixed(2)}`;
});
