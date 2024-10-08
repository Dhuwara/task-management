it('should render the BarChart and PieChart', async () => {
    render(AddTask, {
      global: {
        plugins: [router],
      },
    });

    // Wait for the charts to render
    await screen.findByRole('heading', { name: /tasks/i }); // You may want to check for the heading or some other element
    expect(screen.getByRole('heading', { name: /tasks/i })).toBeInTheDocument();
    // Add checks for specific elements in BarChart and PieChart if needed
  });

  it('should navigate to the root component when clicking the logo', async () => {
    render(AddTask, {
      global: {
        plugins: [router],
      },
    });

    const logoButton = screen.getByRole('button', { name: /Add Task/i });
    await fireEvent.click(logoButton);

    // Assert that the router navigates to the root component
    expect(router.currentRoute.value.fullPath).toBe('/addtask');
  });

  it('should navigate to the user detail component when clicking the assignee', async () => {
    const tableData = [
      { _id: '1', title: 'Task 1', userName: 'User 1', user: 'user1' },
    ];

    vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: tableData });

    render(AddTask, {
      global: {
        plugins: [router],
      },
    });

    await screen.findByText('Task 1');
    const assignee = screen.getByText('User 1');
    await fireEvent.click(assignee);

    expect(router.currentRoute.value.fullPath).toBe('/userdetail/user1');
  });

  it('should navigate to the task detail component when clicking the task name', async () => {
    const tableData = [
      { _id: '1', title: 'Task 1', userName: 'User 1', user: 'user1' },
    ];

    vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: tableData });

    render(AddTask, {
      global: {
        plugins: [router],
      },
    });

    await screen.findByText('Task 1');
    const taskName = screen.getByText('Task 1');
    await fireEvent.click(taskName);

    expect(router.currentRoute.value.fullPath).toBe('/userdetail/user1/taskdetail/1');
  });