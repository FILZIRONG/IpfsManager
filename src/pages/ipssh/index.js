// 批量部署页面
import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./index.css"
import { actionCreator } from './store'
import Layout from 'common/layout'
import { Breadcrumb, Table, Divider, Button, Modal, Input, Form, notification, List } from 'antd'
const { TextArea } = Input;


class Ipssh extends Component {
    constructor(props) {
        super(props)
        this.textAreaIpt = React.createRef()
        this.state = {
            textAreaVal: '',
            selectedRows: []
        }
        this.pressEnter = this.pressEnter.bind(this)
    }
    componentDidMount() {
        // 调用发送方的数据 显示服务器列表
        this.props.handleGetServerHostData()
    }
    pressEnter(e) {
        // 获取文本框中的值
        // console.log(11111111111, e.target.value)
        let { selectedRows } = this.state
        let options = {
            servers: selectedRows,
            cmds: e.target.value
        }
        // 清空文本输入框
        this.textAreaIpt.current.state.value = ''
        // 调用发送方函数, 处理服务器的批量部署
        this.props.handleIpSsh(options)
    }



    render() {
        const { serverhostlist, ipsshtxt } = this.props
        const columns = [
            {
                title: '服务器IP地址',
                dataIndex: 'host',
                align: 'center',
                key: 'host',
                id: 'id'
            }
        ];
        const dataSource = serverhostlist.toJS()

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({selectedRows})
            }
        };

        let ipsshtxtArr = []
        ipsshtxt.toJS().map((item, index) => {
            return item.Result.map((v, i) => {
                if (i == 0) {
                    ipsshtxtArr.push(<h2 style={{color: 'red'}}>{v}</h2>)
                } else {
                    ipsshtxtArr.push(<p style={{color: "#fff"}}>{v}</p>)
                }
            })
        })

        return (
            <div className="News">
                <Layout>
                    <Breadcrumb style={{ margin: '16px 0', textAlign: 'left', fontSize: '16px' }}>
                        <Breadcrumb.Item>批量命令</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ textAlign: 'right', marginBottom: '15px' }}>

                    </div>
                    <div className="content">
                        <div className='content_wrap'>
                            <div className='table_box'>
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    rowSelection={rowSelection}
                                    bordered={true}
                                    rowKey='id'
                                    loading={
                                        {
                                            spinning: this.props.isLoading,
                                            tip: "加载中..."
                                        }
                                    }
                                />
                            </div>
                            <div className='terminal_box'>
                                <div className='terminal_top' style={{background: '#000'}}>
                                    <div>
                                        {
                                            // ipsshtxtArr.map((item, index) => {
                                            //     return item.map((v, i) => {
                                            //         return v.Result.map((s, t) => {
                                            //             return <p style={{color: '#fff'}}>{s}</p>
                                            //         })
                                            //     })
                                            // })
                                            ipsshtxtArr && ipsshtxtArr
                                        }
                                    </div>
                                </div>
                                <div className='terminal_bottom'>
                                    <TextArea
                                        ref={this.textAreaIpt}
                                        rows={8}
                                        allowClear={true}
                                        onPressEnter={this.pressEnter}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="primary" style={{ float: 'right', marginTop: '10px' }}>
                            提交
                        </Button>
                    </div>
                </Layout>
            </div>
        );
    }
}

// 接收方
const mapStateToProps = (state) => ({
    isLoading: state.get('ipssh').get('isLoading'),
    serverhostlist: state.get('ipssh').get('serverhostlist'),
    ipsshtxt: state.get('ipssh').get('ipsshtxt')
})


// 发送方
const mapDispatchToProps = (dispatch) => ({
    handleGetServerHostData: () => { // 处理获取服务器数据列表
        dispatch(actionCreator.handleGetServerHostDataAction())
    },
    handleIpSsh: (options) => { // 处理服务器的批量部署
        dispatch(actionCreator.handleIpSshAction(options))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Ipssh)