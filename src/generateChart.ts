import fs from "fs";
import path from "path";
// @ts-ignore
import { merge } from "mochawesome-merge";

interface ScenarioData {
  name: string;
  duration: number;
}

interface ProcessedData {
  testsByFile: Record<string, number>;
  datasetsByFile: Record<string, ScenarioData[]>;
  passed: number;
  failed: number;
  skipped: number;
  geralEventosDurations: ScenarioData[];
}

function cleanFilePath(file: string): string {
  const normalized = file.replace(/\\/g, "/");
  return normalized.replace("cypress/e2e/api/", "").replace(".cy.ts", "");
}

function breakLine(text: string, limit: number = 25): string[] {
  if (text.length <= limit) return [text];
  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= limit) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  }

  if (currentLine) lines.push(currentLine.trim());

  return lines;
}

async function mergeReports() {
  return await merge({ files: ["cypress/reports/*.json"] });
}

function processSuite(
  suite: any,
  file: string,
  groupKeyPrefix: string,
  isCreateEvents: boolean,
  testsByFile: Record<string, number>,
  datasetsByFile: Record<string, ScenarioData[]>,
  counters: { passed: number; failed: number; skipped: number }
) {
  const describeTitle = suite.title?.trim() || "Raiz";
  const currentGroupKey = isCreateEvents
    ? `${file}::${
        groupKeyPrefix ? groupKeyPrefix + " > " + describeTitle : describeTitle
      }`
    : file;

  if (!datasetsByFile[currentGroupKey]) datasetsByFile[currentGroupKey] = [];

  for (const test of suite.tests || []) {
    testsByFile[file] = (testsByFile[file] || 0) + 1;

    if (test.pass) counters.passed++;
    if (test.fail) counters.failed++;
    if (test.skipped) counters.skipped++;

    const duration = test.duration ?? 0;

    datasetsByFile[currentGroupKey].push({
      name: test.fullTitle,
      duration,
    });
  }

  for (const childSuite of suite.suites || []) {
    processSuite(
      childSuite,
      file,
      groupKeyPrefix ? groupKeyPrefix + " > " + describeTitle : describeTitle,
      isCreateEvents,
      testsByFile,
      datasetsByFile,
      counters
    );
  }
}

function processResults(report: any): ProcessedData {
  const testsByFile: Record<string, number> = {};
  const datasetsByFile: Record<string, ScenarioData[]> = {};
  const counters = { passed: 0, failed: 0, skipped: 0 };

  for (const result of report.results) {
    const file = result.file;
    const cleaned = cleanFilePath(file);
    const isCreateEvents = cleaned.includes("events/createEvents");

    console.log("📂 Arquivo encontrado:", cleaned);

    for (const suite of result.suites || []) {
      processSuite(
        suite,
        file,
        "",
        isCreateEvents,
        testsByFile,
        datasetsByFile,
        counters
      );
    }
  }

  // 🧮 Cálculo da média de duração dos testes de criação de eventos
  const eventDurations: number[] = [];

  Object.entries(datasetsByFile).forEach(([key, scenarios]) => {
    const [filePath] = key.split("::");
    const cleanedPath = cleanFilePath(filePath);
    if (cleanedPath.includes("events/")) {
      scenarios.forEach((s) => eventDurations.push(s.duration));
    }
  });

  if (eventDurations.length > 0) {
    const total = eventDurations.reduce((acc, curr) => acc + curr, 0);
    const media = total / eventDurations.length;
    console.log(
      `📊 Média de duração dos testes na pasta 'events/': ${media.toFixed(2)}ms`
    );
  } else {
    console.log(
      "⚠️ Nenhum teste encontrado na pasta 'events/' para cálculo da média."
    );
  }
  const geralEventosDurations: ScenarioData[] = [];

  Object.entries(datasetsByFile).forEach(([key, scenarios]) => {
    const [filePath] = key.split("::");
    const cleanedPath = cleanFilePath(filePath);
    if (cleanedPath.includes("events/")) {
      scenarios.forEach((s) => geralEventosDurations.push(s));
    }
  });

  return {
    testsByFile,
    datasetsByFile,
    passed: counters.passed,
    failed: counters.failed,
    skipped: counters.skipped,
    geralEventosDurations,
  };
}

function generateChartJS({
  testsByFile,
  datasetsByFile,
  passed,
  failed,
  skipped,
  geralEventosDurations,
}: ProcessedData): string {
  const geralLabels = geralEventosDurations.map((s) =>
    breakLine(s.name.split(" - ")[0])
  );
  const geralData = geralEventosDurations.map((s) => s.duration);

  const labelsFile = Object.keys(testsByFile)
    .map((file) => `"${cleanFilePath(file)}"`)
    .join(", ");
  const dataFile = Object.values(testsByFile).join(", ");

  let canvasElements = "";
  let lineChartsScripts = "";

  Object.entries(datasetsByFile).forEach(([key, scenarios], index) => {
    const keyParts = key.split("::");
    const file = keyParts[0];
    const describe = keyParts[1];
    const canvasId = `chartLine-${index}`;
    const cleanedFile = cleanFilePath(file);
    const cleanedDescribe = describe ? breakLine(describe) : "";

    const labels = scenarios.map((s) => {
      const parts = s.name.split(" - ");
      const text = parts.length > 2 ? parts[1] : parts[0];
      return breakLine(text);
    });
    const data = scenarios.map((s) => s.duration);
    const tooltipTitles = scenarios.map((s) => s.name);

    canvasElements += `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>\n`;

    lineChartsScripts += `
      new Chart(document.getElementById('${canvasId}'), {
        type: 'line',
        data: {
          labels: ${JSON.stringify(labels)},
          datasets: [{
            label: 'Duração por cenário (ms)',
            data: ${JSON.stringify(data)},
            borderColor: '#3b82f6',
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '${
                describe
                  ? `Arquivo: ${cleanedFile} | Describe: ${cleanedDescribe}`
                  : `Arquivo: ${cleanedFile}`
              }'
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  return ${JSON.stringify(tooltipTitles)}[context[0].dataIndex];
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 60,
                minRotation: 60
              }
            }
          }
        }
      });
    `;
  });

  return `
  // Gráfico de Pizza
  new Chart(document.getElementById('chartPie'), {
    type: 'pie',
    data: {
      labels: ['${passed} - Passaram', '${failed} - Falharam', '${skipped} - Ignorados'],
      datasets: [{
        data: [${passed}, ${failed}, ${skipped}],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15']
      }]
    }
  });

  // Gráfico de Barras
  new Chart(document.getElementById('chartBar'), {
    type: 'bar',
    data: {
      labels: [${labelsFile}],
      datasets: [{
        label: 'Testes por arquivo de spec',
        data: [${dataFile}],
        backgroundColor: '#a78bfa'
      }]
    },
    options: {
      indexAxis: 'y'
    }
  });

  // Gráfico de Linha Geral - Duração dos testes da pasta events/
new Chart(document.getElementById('chartLineGeralEventos'), {
  type: 'line',
  data: {
    labels: ${JSON.stringify(geralLabels)},
    datasets: [{
      label: 'Duração por cenário (ms) - Geral (events/)',
      data: ${JSON.stringify(geralData)},
      borderColor: '#3b82f6',
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Geral - Duração dos testes da pasta events/'
      }
    },
    scales: {
      x: {
        ticks: {
          display: false, 
          autoSkip: false,
          maxRotation: 60,
          minRotation: 60
        }
      }
    }
  }
});


  // Canvases para os gráficos de linha
  document.getElementById('chartsByFile').innerHTML = \`${canvasElements}\`;

  // Gráficos de linha por spec
  ${lineChartsScripts}
  `;
}

async function generateCharts() {
  try {
    const report = await mergeReports();
    const processedData = processResults(report);
    const chartData = generateChartJS(processedData);
    fs.writeFileSync(path.resolve("./dist/chart-data.js"), chartData);
    console.log("✅ Arquivo chart-data.js gerado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar os gráficos:", error);
  }
}

generateCharts();
