<template>
	<view>
		<view class="uni-container">
			<!-- 卡片一 -->
			<uni-card title="月度工时计算">
				<view class="date-start-end">
					<text></text>
					<view class="date-start-end-right">
						<label for="queryMonth">输入要查询的月份:</label>
						<input
							style="width: 30px"
							name="queryMonth"
							class="uni-input"
							type="number"
							:value="queryMonth"
							maxlength="2"
							@input="changeQueryMonth"
							placeholder="输入查询的月份"
						/>
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
							<picker mode="time" :value="item.attendanceTime" start="09:01" end="21:01" @change="bindTimeChange(item, 'attendanceTime', $event)">
								<view class="uni-input">{{ item.attendanceTime }}</view>
							</picker>
						</uni-td>
						<uni-td>
							<picker mode="time" :value="item.endAttendance" start="09:01" end="21:01" @change="bindTimeChange(item, 'endAttendance', $event)">
								<view class="uni-input">{{ item.endAttendance }}</view>
							</picker>
						</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td align="center" colspan="2">
							<text>本月需工时: {{ totalManHour }}</text>
							<view>
								<text>已有工时: {{ hasWorkAllHour }}</text>
							</view>
						</uni-td>
						<uni-td align="center" colspan="2">
							<view>
								<text>总工作天数: {{ hasWorkDays }}</text>
							</view>
							<view>
								<text>平均工时: {{ (hasWorkAllHour / hasWorkDays).toFixed(2) }}</text>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</uni-card>
			<!-- 分页 -->
			<!-- <view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view> -->
			<!-- 卡片二 -->
			<uni-card title="设置">
				<view style="margin-bottom: 10px">
					<text >每月需要的平均工时</text>
					<input :value="hoursPerMonth" class="uni-border-input" type="digit" placeholder="请输入数字" />
				</view>
				<view style="margin-bottom: 10px">
					<text >每天休息时间段(不计算工时内)</text>
					<view class="setting-rest-time" v-for="(restTimeItem, index) in restTimeConfig" :key="index">
						<picker class="rest-item-time" mode="time" :value="restTimeItem.startTime" start="09:01" end="21:01" @change="bindTimeChange(restTimeItem, 'startTime', $event)">
							<text>开始时间:{{ restTimeItem.startTime }}</text>
						</picker>
						<picker class="rest-item-time" mode="time" :value="restTimeItem.endTime" start="09:01" end="21:01" @change="bindTimeChange(restTimeItem, 'endTime', $event)">
							<text>结束时间:{{ restTimeItem.endTime }}</text>
						</picker>
					</view>
				</view>
			</uni-card>

			<uni-card title="结果显示">
				<view>
					<text style="margin-bottom: 10px">每天固定休息时间</text>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
	calculateTimeDifference,
	formatDate,
	generateDateRange,
	getDayOfWeek,
	getEndOfWeek,
	getLastDayOfMonth,
	getStartOfWeek,
	getWorkingDaysInCurrentMonth,
	workDayBetweenTwoHours
} from '../../utils/Time';

const queryMonth = ref(new Date().getMonth() + 1);
const restTimeConfig = ref([
	{
		startTime: '00:00',
		endTime: '00:00'
	},
	{
		startTime: '00:00',
		endTime: '00:00'
	}
]);
const hoursPerMonth = ref(8);

const startDate = ref(getStartOfWeek());
const endDate = ref(getEndOfWeek());
const tableData = ref<
	{
		attendanceTime: string;
		endAttendance: string;
		date: string;
	}[]
>([]);

function bindTimeChange(row, key, e) {
	row[key] = e.detail.value;
}

// 修改当前要查询的月份
function changeQueryMonth(event) {
	let inputValue = event.detail.value;
	// 将输入值限制在 1-12 之间
	if (inputValue < 1) {
		inputValue = '1';
	} else if (inputValue > 12) {
		inputValue = '12';
	}
	queryMonth.value = inputValue;
}

// 查询该月总工时
const totalManHour = computed(() => {
	const tempDate = new Date();
	tempDate.setMonth(queryMonth.value - 1);
	return getWorkingDaysInCurrentMonth(tempDate) * hoursPerMonth.value;
});

//  计算已工作天数
const hasWorkDays = computed(() => workDayBetweenTwoHours(tableData.value[0]?.date, tableData.value[tableData.value.length - 1]?.date));
// 计算已打开总工时
const hasWorkAllHour = computed(() => {
	let allHors = 0;
	tableData.value.map((item) => {
		if (parseInt(item.attendanceTime.split(':')[0]) - parseInt(item.endAttendance.split(':')[0]) < 0) {
			allHors += calculateTimeDifference(item.attendanceTime, item.endAttendance);
		}
	});
	return allHors;
});

onMounted(() => {
	// 初始化数据列标
	const currentMonth = new Date().getMonth() + 1;
	if (queryMonth.value === currentMonth) {
		for (let index = 1; index <= new Date().getDate(); index++) {
			tableData.value.push({ date: `${new Date().getFullYear()}-${currentMonth.toString().padStart(2, '0')}-${index}`, attendanceTime: '08:00', endAttendance: '00:00' });
		}
	}

	// uni.setStorage({
	// 	key: 'key',
	// 	data: 'value',
	// 	success: function () {
	// 		// 存储成功的逻辑
	// 		console.log('success');
	// 	}
	// });
});
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

.uni-border-input {
	border: 1px solid $theme-color;
	height: 40px;
	border-radius: 10px;
	padding-left: 20px;
}

// 设置休息时间
.setting-rest-time {
	display: flex;
	flex-direction: row;
	margin-left: 20px;
	.rest-item-time {
		height: 40px;
		margin-right:20px;
		display: flex;
		align-items: center;
	}
}
</style>
