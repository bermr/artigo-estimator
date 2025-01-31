function getSquareMetersCost(squareMeters, isWetArea, isArchitecturalProject) {
  if (isArchitecturalProject) {
    return 120 * squareMeters;
  }

  if (isWetArea) {
    return 70 * squareMeters;
  }

  let multiplier;
  if (squareMeters < 25) {
    multiplier = 65;
  } else if (squareMeters > 40) {
    multiplier = 60;
  } else {
    multiplier = 50;
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
  isArchitecturalProject,
  isUrgent,
  monitoring
) {
  const squareMetersCost = getSquareMetersCost(squareMeters, isWetArea, isArchitecturalProject);

  const visitsCost = 80 * 2 * numberOfVisits;

  const urgentMultiplier = isUrgent ? 1.2 : 1;
  const monitoringMultiplier = monitoring ? 1.2 : 1;

  if (!isProject) {
    return roundToNearestTen(((squareMetersCost + 160 + visitsCost) * 1.2) * urgentMultiplier);
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

  return roundToNearestTen(totalCost * urgentMultiplier * monitoringMultiplier);
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
    const isUrgent = parseInt(document.getElementById("isUrgent").value);

    const isProject = projectType === "project";

    const isArchitecturalProject = projectType === "aProject";

    const monitoring = parseInt(document
      .getElementById("monitoring")
      .value);

    const totalCost = estimateCost(
      squareMeters,
      complexity,
      numberOfVisits,
      isWetArea,
      isProject,
      isArchitecturalProject,
      isUrgent,
      monitoring
    );

    let message =
      projectType === "project"
        ? "Custo do projeto: " : projectType === "consultancy" ?
          "Custo da consultoria: " : "Custo do projeto arquitetônico: ";

    message += formatInReais(totalCost);

    document.getElementById("result-container").style.display = 'block';
    document.getElementById("result").innerHTML = message;
  });

document.getElementById("projectType").addEventListener("change", function() {
  const selectedValue = this.value;
  const complexityComponent = document.getElementById("complexity");
  const complexityLabel = document.getElementById("complexityLabel");

  const monitoringComponent = document.getElementById("monitoring");
  const monitoringLabel = document.getElementById("monitoringLabel");

  if (selectedValue === "consultancy" || selectedValue === 'aProject') {
    complexityComponent.style.display = "none";
    monitoringComponent.style.display = "none";
    complexityLabel.style.display = "none";
    monitoringLabel.style.display = "none";
  } else {
    complexityComponent.style.display = "flex";
    monitoringComponent.style.display = "flex";
    complexityLabel.style.display = "flex";
    monitoringLabel.style.display = "flex";
  }
});
