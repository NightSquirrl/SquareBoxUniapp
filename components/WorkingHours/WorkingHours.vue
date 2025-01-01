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
					</uni-tr>
				</uni-table>
			</uni-card>
			<!-- 分页 -->
			<!-- <view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view> -->
			<uni-card title="设置">
				<view>
					<text style="margin-bottom: 10px">每天固定休息时间</text>
					<input :value="restTime" class="uni-border-input" type="digit" placeholder="带小数点的数字键盘" />
				</view>
			</uni-card>

			<uni-card title="结果显示">
				<view>
					<text style="margin-bottom: 10px">每天固定休息时间</text>
					<input :value="restTime" class="uni-border-input" type="digit" placeholder="带小数点的数字键盘" />
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { formatDate, generateDateRange, getDayOfWeek, getEndOfWeek, getLastDayOfMonth, getStartOfWeek } from '../../utils/Time';

function selectionChange() {}
const startDate = ref(getStartOfWeek());
const endDate = ref(getEndOfWeek());
const restTime = ref(0);
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
	// 开始的时间需要小于结束时间
	if (new Date(e.detail.value).getTime() - new Date(endDate.value).getTime() < 0) {
		startDate.value = e.detail.value;
	}
}
function bindEndDate(e) {
	const currentDate = new Date(e.detail.value);
	if (currentDate.getTime() - new Date(startDate.value).getTime() > 0) {
		// 并且时间不允许超过开始时间的月份
		if (currentDate.getMonth() === new Date(startDate.value).getMonth()) {
			endDate.value = e.detail.value;
		} else {
			currentDate.setMonth(new Date(startDate.value).getMonth());
			currentDate.setFullYear(new Date(startDate.value).getFullYear());
			currentDate.setDate(getLastDayOfMonth(startDate.value));
			endDate.value = formatDate(currentDate.getTime());
		}
	}
}

watch(
	() => [startDate, endDate],
	(newData, oldData) => {
		//  最后修改本次是否存在数据 ,动态生成
		tableData.value = generateDateRange(startDate.value, endDate.value);
	},
	{
		immediate: true,
		deep: true
	}
);

onMounted(() => {
	// 初始化结束时间
	const tempEndDate = startDate.value;
	const tempEndDateArray = tempEndDate.split('-');
	tempEndDateArray[2] = getLastDayOfMonth(startDate.value).toString();
	endDate.value = tempEndDateArray.join('-');
	uni.setStorage({
	  key: 'key',
	  data: 'value',
	  success: function () {
	    // 存储成功的逻辑
		console.log('success');
	  }
	});
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
</style>
