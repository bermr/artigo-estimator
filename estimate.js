const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

function estimate() {
  rl.question("Projeto ou consultoria? (p/c)", (isProject) => {
    rl.question("Enter the number of square meters: ", (squareMeters) => {
      rl.question(
        "Enter the complexity level (low, medium, high): ",
        (complexity) => {
          rl.question("Enter the number of visits: ", (numberOfVisits) => {
            rl.question("Wet area? (y/n): ", (isWetArea) => {
              squareMeters = parseFloat(squareMeters);
              numberOfVisits = parseInt(numberOfVisits);
              complexity = complexity.toLowerCase();
              isWetArea = isWetArea === "y";
              isProject = isProject === "p";

              if (isNaN(squareMeters) || isNaN(numberOfVisits) || !complexity) {
                console.log("Please enter valid values.");
              } else {
                const estimate = estimateCost(
                  squareMeters,
                  complexity,
                  numberOfVisits,
                  isWetArea,
                  isProject,
                );
                console.log(
                  `The project cost estimate is: $${estimate.toFixed(2)}`,
                );
              }

              rl.close();
            });
          });
        },
      );
    });
  });
}

estimate();
