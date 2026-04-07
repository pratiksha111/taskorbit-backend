const Task = require("../models/taskModel");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, user: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 5, sort } = req.query;

    // 1 Base query (always filter by logged-in user)
    let query = { user: req.user.id };

    // 2 Filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // 3 Search (title)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 4 Pagination
    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNumber - 1) * pageLimit;

    // 5 Execute query
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    //6 total count (for frontend pagination)
    const total = await Task.countDocuments(query);

    res.status(200).json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageLimit),
      tasks,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("TASK:", task);
    console.log("TASK USER:", task.user);
    console.log("REQ USER:", req.user);

    if (!task.user) {
      return res.status(400).json({ message: "Task has no user" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message : "Task not found"});

        if(task.user.toString() != req.user.id){
            return res.status(401).json({ message : "Unauthorized User"});
        }

        await task.deleteOne();
        res.json({ message :"Task Deleted!!"});


    } catch(error){
        res.status(500).json({ message : error.message});
    }
};
