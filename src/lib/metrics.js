import si from "systeminformation";

export async function getSystemMetrics() {
  const [cpu, mem, disk, time] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.time(),
  ]);

  const cpuUsage = Math.round(cpu.currentLoad);
  const memUsage = Math.round((mem.active / mem.total) * 100);

  const mainDisk = disk[0] || { use: 0 };
  const diskUsage = Math.round(mainDisk.use);

  return {
    cpu: cpuUsage,
    memory: memUsage,
    disk: diskUsage,
    uptime: time.uptime,
  };
}