<template>
	<view>
		<view class="uni-container">
			<uni-card title="高级时间计算器">
				<view class="date-start-end">
					<text>1</text>
					<text>2</text>
				</view>
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center">日期</uni-th>
						<uni-th width="150" align="center">出勤开始</uni-th>
						<uni-th align="center">出勤结束</uni-th>
						<uni-th width="204" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>
							<!-- <view class="name">{{ item.name }}</view> -->
							<picker mode="time" :value="item.attendanceTime" start="09:01" end="21:01" @change="bindTimeChange(item,$event)">
								<view class="uni-input">{{ item.attendanceTime }}</view>
							</picker>
						</uni-td>
						<!-- <uni-td align="center">{{ item.address }}</uni-td> -->
						<!-- 					<uni-td>
							<view class="uni-group">
								<button class="uni-button" size="mini" type="primary">修改</button>
								<button class="uni-button" size="mini" type="warn">删除</button>
							</view>
						</uni-td> -->
					</uni-tr>
				</uni-table>
			</uni-card>

			<!-- <view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view> -->
		</view>
	</view>
</template>

<script lang="ts" setup>
function selectionChange() {}
const tableData = [
	{
		attendanceTime: '08:00'
	}
];

function bindTimeChange(row,e) {
	row.attendanceTime = e.detail.value
}
</script>

<style lang="scss" scoped>
@import '../../uni.scss';
.uni-group {
	display: flex;
	align-items: center;
}
.date-start-end {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
}
.uni-table-tr:nth-child(2n + 3) {
	background-color: $theme-color !important;
	.table--border {
		color: #ffffff !important;
		border-color: #ffffff !important;
	}
}
</style>
