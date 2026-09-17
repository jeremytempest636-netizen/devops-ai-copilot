import Docker from "dockerode";

const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : { socketPath: "/var/run/docker.sock" }
);

function classifyStatus(state) {
  if (state.Status === "running" && state.Health?.Status === "unhealthy") {
    return "warning";
  }
  if (state.Status === "running") return "running";
  if (state.Status === "restarting") return "restarting";
  return "warning";
}

export async function getContainers() {
  const containers = await docker.listContainers({ all: true });

  const results = await Promise.all(
    containers.map(async (c) => {
      const container = docker.getContainer(c.Id);
      let cpu = "--";
      let memory = "--";

      try {
        const stats = await container.stats({ stream: false });
        const cpuDelta =
          stats.cpu_stats.cpu_usage.total_usage -
          stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta =
          stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuPercent =
          systemDelta > 0 ? (cpuDelta / systemDelta) * 100 : 0;

        cpu = `${Math.round(cpuPercent)}%`;
        memory = `${Math.round(stats.memory_stats.usage / 1024 / 1024)} MB`;
      } catch (e) {
        // container might be restarting/stopped, stats unavailable
      }

      return {
        name: c.Names[0].replace("/", ""),
        status: classifyStatus({ Status: c.State }),
        cpu,
        memory,
      };
    })
  );

  return results;
}