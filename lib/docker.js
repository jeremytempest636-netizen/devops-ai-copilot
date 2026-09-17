import Docker from "dockerode";

const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : { socketPath: "/var/run/docker.sock" }
);

function classifyStatus(state, health) {
  if (state === "running") {
    if (health === "unhealthy") return "warning";
    return "running";
  }
  if (state === "restarting") return "restarting";
  return "stopped";
}

export async function getContainers() {
  const containers = await docker.listContainers({ all: true });

  const results = await Promise.all(
    containers.map(async (c) => {
      const container = docker.getContainer(c.Id);
      const status = classifyStatus(c.State, c.Status?.includes("unhealthy") ? "unhealthy" : null);

      let cpu = "--";
      let memory = "--";

      // Hanya ambil stats kalau container benar-benar running
      if (c.State === "running") {
        try {
          const stats = await container.stats({ stream: false });

          const cpuDelta =
            stats.cpu_stats?.cpu_usage?.total_usage -
            stats.precpu_stats?.cpu_usage?.total_usage;
          const systemDelta =
            stats.cpu_stats?.system_cpu_usage - stats.precpu_stats?.system_cpu_usage;

          if (Number.isFinite(cpuDelta) && Number.isFinite(systemDelta) && systemDelta > 0) {
            cpu = `${Math.round((cpuDelta / systemDelta) * 100)}%`;
          } else {
            cpu = "0%";
          }

          const memUsage = stats.memory_stats?.usage;
          if (Number.isFinite(memUsage)) {
            memory = `${Math.round(memUsage / 1024 / 1024)} MB`;
          }
        } catch (e) {
          // stats gagal diambil, biarkan "--"
        }
      }

      return {
        name: c.Names[0].replace("/", ""),
        status,
        cpu,
        memory,
      };
    })
  );

  // Hanya tampilkan container yang running atau bermasalah (bukan yang sudah lama exited)
  return results.filter((c) => c.status !== "stopped");
}