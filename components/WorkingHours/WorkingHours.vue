<template>
	<view>
		<view class="uni-container">
			<uni-card title="高级时间计算器">
				<view class="date-start-end">
					<text></text>
					<view class="date-start-end-right">
						<picker mode="date" :value="startDate" @change="bindStartDate">
							<view class="uni-input">{{ startDate }}</view>
						</picker>
						<uni-icons style="margin-right: 20px" custom-prefix="iconfont" type="icon-rili" size="15"></uni-icons>
						<picker mode="date" :value="endDate" @change="bindEndDate">
							<view class="uni-input">{{ endDate }}</view>
						</picker>
						<uni-icons custom-prefix="iconfont" type="icon-rili" size="15"></uni-icons>
					</view>
				</view>
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="80" align="center">日期</uni-th>
						<uni-th width="60" align="center">星期</uni-th>
						<uni-th width="70" align="center">出勤开始</uni-th>
						<uni-th width="70" align="center">出勤结束</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">
							<text style="font-size: 12px">{{ item.date }}</text>
						</uni-td>
						<uni-td align="center">
							<text>{{ getDayOfWeek(item.date) }}</text>
						</uni-td>
						<uni-td>
							<picker mode="time" :value="item.attendanceTime" start="09:01" end="21:01" @change="bindTimeChange(item, $event)">
								<view class="uni-input">{{ item.attendanceTime }}</view>
							</picker>
						</uni-td>
						<uni-td>
							<picker mode="time" :value="item.endAttendance" start="09:01" end="21:01" @change="bindTimeChange(item, $event)">
								<view class="uni-input">{{ item.endAttendance }}</view>
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
import { ref, watch } from 'vue';
import { generateDateRange, getDayOfWeek, getEndOfWeek, getStartOfWeek } from '../../utils/Time';

function selectionChange() {}
const startDate = ref(getStartOfWeek());
const endDate = ref(getEndOfWeek());
const tableData = ref<
	{
		attendanceTime: string;
		endAttendance: string;
		date: string;
	}[]
>([]);

function bindTimeChange(row, e) {
	row.attendanceTime = e.detail.value;
}
function bindStartDate(e) {
	startDate.value = e.detail.value;
}
function bindEndDate(e) {
	endDate.value = e.detail.value;
}
watch(
	() => [startDate, endDate],
	(newData, oldData) => {
		tableData.value = generateDateRange(startDate.value, endDate.value);
		console.log(11);
	},
	{
		immediate: true,
		deep: true
	}
);
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
	.date-start-end-right {
		display: flex;
		flex-direction: row;
	}
}

.uni-table-tr:nth-child(2n + 3) {
	background-color: $theme-color !important;

	.table--border {
		color: #ffffff !important;
		border-color: #ffffff !important;
	}
}

.uni-table-th {
	font-size: 12px !important;
}
</style>
