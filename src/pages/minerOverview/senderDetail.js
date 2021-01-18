// 发送方详情页面
import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./index.css"
import { actionCreator } from './store'
import Layout from 'common/layout'
import { Breadcrumb, Table, Radio, Select } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
const { Option } = Select;

class SenderDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newListType: ''
        }
        this.handleNewListRadioChange = this.handleNewListRadioChange.bind(this)
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.handleNewListSelectChange = this.handleNewListSelectChange.bind(this)
    }
    componentDidMount() {
        console.log(1111111111111, this.props);
        // 调用发送方函数, 处理有效算力折线图数据
        this.props.handleEchartsData()
        // 调用发送方函数, 处理消息列表数据
        let newListOptions = {name: 'minermessage', page: 1}
        this.props.handleNewList(newListOptions)
        setInterval(() => {
            this.props.handleEchartsData()
            this.props.handleNewList(newListOptions)
        }, 7800000)
    }
    // 处理消息列表单选框改变事件
    handleNewListRadioChange (val) {
        console.log('val++++++++++++', val.target.value)
        this.setState({newListType: val.target.value})
        let options = {
            name: '',
            page: 1
        }
        if (val.target.value == '消息列表') {
            options.name = 'minermessage'
        } else if (val.target.value == '区块列表') {
            options.name = 'minerblocks'
        } else if (val.target.value == '转账列表') {
            options.name = 'minertransfors'
        }
        // 调用发送函数, 处理消息, 区块, 转账列表数据
        this.props.handleNewList(options)
    }
    // 处理表格分页器
    handlePaginationChange (page, pageSize) {
        console.log('page--------', page)
        let options = {
            name: '',
            page
        }
        if (this.state.newListSelectType == 'minermessage') {
            options.name = 'minermessage'
        } else {
            options.name = 'minermessagebymethod'
            options.method = this.state.newListSelectType
        }
        // 调用发送方函数, 处理消息列表数据
        this.props.handleNewList(options)
    }
    // 处理消息列表下拉框改变事件
    handleNewListSelectChange (val) {
        console.log('val==============', val);
        if (val == '全部') {
            this.setState({newListSelectType: 'minermessage'})
        } else {
            this.setState({newListSelectType: val})
        }
        // 调用发送方函数, 处理消息列表数据
        let newListOptions = {name: 'minermessagebymethod', page: 1, method: val}
        this.props.handleNewList(newListOptions)
    }


    render() {
        const { powerEchartsDataList, newListData, newListSelectData, totalCount } = this.props
        // ---------------------------------------------- 有效算力折线图数据 ----------------------------------------
        let powerEchartsData = []
        if (powerEchartsDataList.toJS().length > 0) {
            powerEchartsData = powerEchartsDataList.toJS();
        }
        const cols = {
            time: {
                nice: true,
                alias: "时间"
            },
            miner_power_quality: {
                nice: true,
                alias: "有效算力"
            }
        }
        // ---------------------------------------------- 有效算力折线图数据 ----------------------------------------
        // ---------------------------------------------- 消息列表表格数据 ----------------------------------------
        let columns = []
        let dataSource = []
        if (newListData.toJS().length > 0) {
            if (this.state.newListType == '' || this.state.newListType == '消息列表') {
                columns = [
                    { title: () => (<span className='text_title'>消息ID</span>), className: 'txt_bolder', dataIndex: 'Cid', key: 'Cid', align: 'center', ellipsis: true, render: (Cid) => (<span className="cursor_hover" onClick={ () => this.handleGoPage(Cid, 'messageIdDetailPage')}>{Cid}</span>) },
                    { title: () => (<span className='text_title'>区块高度</span>), className: 'txt_color txt_bolder', dataIndex: 'Height', key: 'Height', align: 'center', ellipsis: true, render: (Height) => (<span className="cursor_hover" style={{color: '#1a4fc9'}} onClick={ () => this.handleGoPage(Height, 'heightDetailPage')}>{Height}</span>) },
                    { title: () => (<span className='text_title'>时间</span>), className: 'txt_bolder', dataIndex: 'TimeCreate', key: 'TimeCreate', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>发送方</span>), className: 'txt_bolder', dataIndex: 'From', key: 'From', align: 'center', ellipsis: true, render: (From) => (<span className="cursor_hover" onClick={ () => this.handleGoPage(From, 'senderDetailPage')}>{From}</span>) },
                    { title: () => (<span className='text_title'>接收方</span>), className: 'txt_bolder', dataIndex: 'To', key: 'To', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>方法</span>), className: 'txt_bolder', dataIndex: 'Method', key: 'Method', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>金额</span>), className: 'txt_bolder', dataIndex: 'Balance', key: 'Balance', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>状态</span>), className: 'txt_bolder', dataIndex: 'Status', key: 'Status', align: 'center', ellipsis: true }
                ]
                dataSource = newListData.toJS()
            } else if (this.state.newListType == '转账列表') {
                columns = [
                    { title: () => (<span className='text_title'>时间</span>), className: 'txt_bolder', dataIndex: 'TimeCreate', key: 'TimeCreate', align: 'center', ellipsis: true},
                    { title: () => (<span className='text_title'>消息ID</span>), className: 'txt_bolder', dataIndex: 'MessageId', key: 'MessageId', align: 'center', ellipsis: true, render: (MessageId) => (<span className="cursor_hover" onClick={ () => this.handleGoPage(MessageId, 'messageIdDetailPage')}>{MessageId}</span>) },
                    { title: () => (<span className='text_title'>发送方</span>), className: 'txt_bolder', dataIndex: 'From', key: 'From', align: 'center', ellipsis: true, render: (From) => (<span className="cursor_hover" onClick={ () => this.handleGoPage(From, 'senderDetailPage')}>{From}</span>) },
                    { title: () => (<span className='text_title'>接收方</span>), className: 'txt_bolder', dataIndex: 'To', key: 'To', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>净收入</span>), className: 'txt_bolder', dataIndex: 'Balance', key: 'Balance', align: 'center', ellipsis: true },
                    { title: () => (<span className='text_title'>类型</span>), className: 'txt_bolder', dataIndex: 'TransferType', key: 'TransferType', align: 'center', ellipsis: true }
                ]
                dataSource = newListData.toJS()
            }
        }
        // ---------------------------------------------- 消息列表表格数据 ----------------------------------------

        return (
            <div className="News">
                <Layout>
                    <Breadcrumb style={{ margin: '16px 0', textAlign: 'left', fontSize: '16px' }}>
                        <Breadcrumb.Item>账户 <span>f3wu4i2wt3gbiun7iymuyn2xd2txw7gcgw5ikyjkvavyl5gle2xmi3bksqtqhxclxftlhm2k73bkkprepg6j5q</span></Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="accountOverview_content">
                        <div>
                            <div>
                                <Breadcrumb style={{ margin: '16px 0', textAlign: 'left', fontSize: '16px' }}>
                                    <Breadcrumb.Item>账户概览</Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            <div className="accountOverview_box">
                                <p><span>地址</span><span>f3wu4i2wt3gbiun7iymuyn2xd2txw7gcgw5ikyjkvavyl5gle2xmi3bksqtqhxclxftlhm2k73bkkprepg6j5q</span></p>
                                <p><span>ID</span><span>f015715</span></p>
                                <p><span>类型</span><span>普通账户</span></p>
                                <p><span>余额</span><span>313.8457448174351 FIL</span></p>
                                <p><span>消息数</span><span>36640</span></p>
                                <p><span>创建时间</span><span>2020-08-31 18:48:00</span></p>
                                <p><span>最新交易</span><span>2021-01-18 14:22:00</span></p>
                                <p><span>名下矿工</span><span>f015734</span></p>
                                <p><span>实际工作矿工</span><span>f015734</span></p>
                            </div>
                        </div>
                        <div style={{width: '100%', marginTop: '50px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <Breadcrumb style={{ margin: '16px 0', textAlign: 'left', fontSize: '16px' }}>
                                        <Breadcrumb.Item>账户变化</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                <div>
                                    <Radio.Group defaultValue="24" buttonStyle="solid" onChange={this.handleRadioChange}>
                                        <Radio.Button value="24">24h</Radio.Button>
                                        <Radio.Button value="7">7天</Radio.Button>
                                        <Radio.Button value="30">30天</Radio.Button>
                                        <Radio.Button value="1">1年</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </div>
                            <div>
                                <Chart height={400} data={powerEchartsData} scale={cols} forceFit padding={[ 20, 100, 20, 100 ]}>
                                    <Axis
                                        name="time"
                                        line={{
                                            stroke: "#E6E6E6"
                                        }}
                                    />
                                    <Axis
                                        name="miner_power_quality"
                                        label={{
                                            formatter: val => `${val} TiB`
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Geom
                                        type="line"
                                        position="time*miner_power_quality"
                                        size={1}
                                        color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
                                        shape="smooth"
                                        style={{
                                            shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
                                            shadowBlur: 60,
                                            shadowOffsetY: 6
                                        }}
                                        tooltip={['time*miner_power_quality', (time, miner_power_quality) => {
                                            return {
                                                name: '有效算力',
                                                title: time,
                                                value: miner_power_quality + ' TiB'
                                            };
                                        }]}
                                    />
                                </Chart>
                            </div>
                            <div className="newList_wrap" style={{padding: '0'}}>
                                <div className="newList_top_wrap">
                                    <div className="top_left_wrap">
                                        <Radio.Group defaultValue="消息列表" buttonStyle="solid" onChange={this.handleNewListRadioChange}>
                                            <Radio.Button value="消息列表">消息列表</Radio.Button>
                                            <Radio.Button value="转账列表">转账列表</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    {
                                        newListSelectData.toJS().length > 0 && (
                                            <div className="top_right_wrap">
                                                <Select defaultValue="全部" style={{ width: 200 }} onChange={this.handleNewListSelectChange}>
                                                    <Option value='全部'>全部</Option>
                                                    {
                                                        newListSelectData.toJS().map((item, index) => (
                                                            <Option value={item}>{item}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="newList_bottom_wrap">
                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        rowKey='id'
                                        loading={
                                            {
                                                spinning: this.props.isLoading,
                                                tip: "加载中..."
                                            }
                                        }
                                        style={{ marginTop: '30px' }}
                                        pagination={{
                                            showQuickJumper: true,
                                            defaultCurrent: 1,
                                            total: totalCount,
                                            pageSize: 20,
                                            onChange: this.handlePaginationChange
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </div>
        )
    }
}

// 接收方
const mapStateToProps = (state) => ({
    isLoading: state.get('minerOverview').get('isLoading'),
    powerEchartsDataList: state.get('minerOverview').get('powerEchartsDataList'),
    newListData: state.get('minerOverview').get('newListData'),
    newListSelectData: state.get('minerOverview').get('newListSelectData'),
    totalCount: state.get('minerOverview').get('totalCount')
})


// 发送方
const mapDispatchToProps = (dispatch) => ({
    handleEchartsData: () => {
        dispatch(actionCreator.handleEchartsDataAction())
    },
    handleNewList: (options) => {
        dispatch(actionCreator.handleNewListAction(options))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SenderDetail)