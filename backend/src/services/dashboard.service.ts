import { Project } from "../models/project.model.ts";
import { Task } from "../models/task.model.ts";

export async function getDashboard(userId: string, isAdmin: boolean) {
  const projectFilter = isAdmin ? {} : { members: userId };
  const projects = await Project.find(projectFilter).select("_id");
  const projectIds = projects.map((project) => project._id);
  const taskFilter = { project: { $in: projectIds } };
  const now = new Date();

  const [totalTasks, overdueTasks, statusCounts, assignedToMe] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, dueDate: { $lt: now }, status: { $ne: "done" } }),
    Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.countDocuments({ assignedTo: userId, status: { $ne: "done" } }),
  ]);

  return {
    projects: projects.length,
    tasks: {
      total: totalTasks,
      overdue: overdueTasks,
      assignedToMe,
      byStatus: statusCounts.reduce<Record<string, number>>((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    },
  };
}
