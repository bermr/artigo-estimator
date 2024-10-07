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

function roundToNearestTen(num) {
  return Math.ceil(num / 10) * 10;
}

function estimateCost(
  squareMeters,
  complexity,
  numberOfVisits,
  isWetArea,
  isProject,
) {
  const squareMetersCost = getSquareMetersCost(squareMeters, isWetArea);

  const visitsCost = 80 * 2 * numberOfVisits;

  if (!isProject) {
	return roundToNearestTen((squareMetersCost + 160 + visitsCost) * 1.2);
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

  const operationalCosts = visitsCost + 240 + 160 + 100 + 150;

  const totalCost =
    squareMetersCost +
    squareMetersCost * (1.5 + complexityPerSquareMeter[complexity] / 100) +
    operationalCosts;

  return roundToNearestTen(totalCost);
}

function formatInReais(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

document
  .getElementById("cost-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    const projectType = document.getElementById("projectType").value;
    const squareMeters = parseFloat(
      document.getElementById("squareMeters").value,
    );
    const complexity = document
      .getElementById("complexity")
      .value.toLowerCase();
    const numberOfVisits = parseInt(
      document.getElementById("numberOfVisits").value,
    );
    const isWetArea = parseInt(document.getElementById("isWetArea").value);

    const isProject = projectType === "project";

    const totalCost = estimateCost(
      squareMeters,
      complexity,
      numberOfVisits,
      isWetArea,
      isProject,
    );

    let message =
      projectType === "project"
        ? "Custo do projeto: "
        : "Custo da consultoria: ";

    message += formatInReais(totalCost);

    document.getElementById("result").innerText = message;
  });

document.getElementById("projectType").addEventListener("change", function() {
  const selectedValue = this.value;
  const component = document.getElementById("complexity");
  const label = document.getElementById("complexityLabel");

  if (selectedValue === "consultancy") {
    component.style.display = "none";
    label.style.display = "none";
  } else {
    component.style.display = "flex";
    label.style.display = "flex";
  }
});
