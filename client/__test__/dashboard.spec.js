// tests/Dashboard.spec.js
import { mount } from '@vue/test-utils'
import Dashboard from '../src/components/DashboardPage.vue'

describe('Dashboard.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(Dashboard)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders task titles correctly', () => {
    const tableData = [
      { _id: '1', title: 'Task 1', user: 'User 1' },
      { _id: '2', title: 'Task 2', user: 'User 2' },
    ]
    const wrapper = mount(Dashboard, {
      data() {
        return { tableData }
      }
    })
    const taskTitles = wrapper.findAll('td.hover-effect')
    expect(taskTitles.length).toBe(2)
    expect(taskTitles[0].text()).toBe('Task 1')
    expect(taskTitles[1].text()).toBe('Task 2')
  })
})
