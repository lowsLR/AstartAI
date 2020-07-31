/*
思路：链接：https://blog.csdn.net/zgaoq/article/details/79605462
1：将起始点加入OPEN表中
2：循环直到OPEN为空或者终点加入CLOSE表中
否则：找到OPEN表中F值最小的节点(使用堆排序得到小值点)，将此点从OPEN删除，加入CLOSE！(此时最小点已经取出，那么需要从新排序OPEN表，是的第一个点是最小F的点！)

对8个邻居进行处理：
若：1：邻居已经在CLOSE表中了，那么不需要考虑了~
2：邻居是障碍物，不需要考虑了e
3：邻居不在OPEN表中，那么将邻居加入OPEN，并将次邻居的父节点赋值为当前节点
4：邻居在OPEN中，那么需要看看此邻居点的G值与当前点的(G值+当前点到邻居点的距离大小，如果从此点走更近(即G值更小)，那么将此点的父节点换成当前点(注意：对于同一个点，G值下，那么F必须小！因为H是相同的！)
   注意：当父节点改变后，OPEN表中的最小点可能会变化，那么需要再次排序得到最小点！
*/

let map_maze = []; // 地图
let open_table = []; //可行走的表格
let close_table = []; //不可行走的表格
let path_stack = []; // 路径
let is_found = 0; //0 表示路径不可行 1可行
let open_node_count = 0; //可行走的路径记录下标
let close_node_count = 0; //行走后的路径记录下标
let top = -1; //path_stack数组的下标
//每个格子的高宽
let map_height = 0;
let map_width = 0;
let BARRIER = 1; //障碍物
// 在点击世界坐标后寻找对应的地图坐标
function astar_search(map, src_x, src_y, dst_x, dst_y) {
	let path = [];
	// console.log(map, src_x, src_y, dst_x, dst_y, "===???") //假设(13,8) (16 ,8)
	if (src_x == dst_x && src_y == dst_y) {
		console.log("起点==终点!");
		return path;
	}
	astar_init(map);
	let start_node = map_maze[src_y * map.width + src_x]; //起点 8*30+13=253
	let end_node = map_maze[dst_y * map.width + dst_x]; //终点8*30+16 = 256
	// console.log(start_node,end_node,"==?起始点")
	let curr_node = null;
	open_table[open_node_count++] = start_node; //记录下player开始所在的地图位置
	start_node.s_is_in_opentable = 1; // 加入open表 
	start_node.s_g = 0; //从始点起，沿着产生的路径，移动到网格上指定方格的路径
	start_node.s_h = Math.abs(end_node.s_x - start_node.s_x) + Math.abs(end_node.s_y - start_node.s_y); // H值的估计采用“曼哈顿”法，也就是当前的点，到目标点，横向和纵向的格子数相加
	start_node.s_parent = null;
	// console.log(start_node.s_h,"===>??start_node.s_h")
	is_found = 0;
	while (1) {
		curr_node = open_table[0]; // open表的第一个点一定是f值最小的点(通过堆排序得到的)权值越小，越靠近目标点。
		open_table[0] = open_table[--open_node_count]; // 最后一个点放到第一个点，然后进行堆调整
		// console.log("执行了",open_table[0])//会卡死
		adjust_heap(0); //调整堆
		close_table[close_node_count++] = curr_node; // 当前点加入close表
		curr_node.s_is_in_closetable = 1; // 已经在close表中了
		// 终点在close中，结束
		if (curr_node.s_x == end_node.s_x && curr_node.s_y == end_node.s_y) {
			is_found = 1;
			break;
		}
		get_neighbors(curr_node, end_node); // 对邻居的处理
		// 没有路径到达
		if (open_node_count == 0) {
			is_found = 0;
			break;
		}
	}
}
// 对邻居的处理 
function get_neighbors(curr_node, end_node) {
	let x = curr_node.s_x;
	let y = curr_node.s_y;
	//四个方向的处理
	if ((x + 1) >= 0 && (x + 1) < map_height && y >= 0 && y < map_width) {
		//右边
		insert_to_opentable(x + 1, y, curr_node, end_node, 10);
	}
	if ((x - 1) >= 0 && (x - 1) < map_height && y >= 0 && y < map_width) {
		//左边
		insert_to_opentable(x - 1, y, curr_node, end_node, 10);
	}
	if (x >= 0 && x < map_height && (y + 1) >= 0 && (y + 1) < map_width) {
		//上边
		insert_to_opentable(x, y + 1, curr_node, end_node, 10);
	}
	if (x >= 0 && x < map_height && (y - 1) >= 0 && (y - 1) < map_width) {
		//下边
		insert_to_opentable(x, y - 1, curr_node, end_node, 10);
	}
}
//方向处理
function insert_to_opentable(x, y, curr_node, end_node, w) {
	let i;
	// 不是障碍物 
	if (map_maze[x * map_width + y].s_style != BARRIER) {
		// 不在闭表中 
		if (!map_maze[x * map_width + y].s_is_in_closetable) {
			// 在open表中  
			if (map_maze[x * map_width + y].s_is_in_opentable) {
				// 需要判断是否是一条更优化的路径
				if (map_maze[x * map_width + y].s_g > curr_node.s_g + w) {
					map_maze[x * map_width + y].s_g = curr_node.s_g + w;
					map_maze[x * map_width + y].s_parent = curr_node; //f值
					for (i = 0; i < open_node_count; ++i) {
						if (open_table[i].s_x == map_maze[x * map_width + y].s_x && open_table[i].s_y == map_maze[x * map_width + y].s_y) {
							break;
						}
					}
					adjust_heap(i); // 下面调整点  
				}
			} else {
				//不在open中 
				map_maze[x * map_width + y].s_g = curr_node.s_g + w;
				map_maze[x * map_width + y].s_h = Math.abs(end_node.s_x - x) + Math.abs(end_node.s_y - y);
				map_maze[x * map_width + y].s_parent = curr_node;
				map_maze[x * map_width + y].s_is_in_opentable = 1;
				open_table[open_node_count++] = (map_maze[x * map_width + y]);
			}
		}
	}
}
//计算路径，将排序行走路径的坐标 
function adjust_heap(nIndex) {
	let curr = nIndex;
	let child = curr * 2 + 1; // 得到左孩子idx( 下标从0开始，所有做孩子是curr*2+1 ) 1,3,5,7
	let parent = Math.floor((curr - 1) / 2); // 得到双亲idx 
	if (nIndex < 0 || nIndex >= open_node_count) return; // 不存在idx，就直接返回，说明此时，player是出于静止状态；
	// 往下调整( 要比较左右孩子和cuur parent )  
	while (child < open_node_count) {
		// 小根堆是双亲值小于孩子值 
		if (child + 1 < open_node_count && open_table[child].s_g + open_table[child].s_h > open_table[child + 1].s_g +
			open_table[child + 1].s_h) {
			// 假设curr为1，则child 为3，open_node_count>4,open_table下标3的比下标4的(f=g+h)大，f权重越小，越靠近目标。
			++child;
		}
		if (open_table[curr].s_g + open_table[curr].s_h <= open_table[child].s_g + open_table[child].s_h) {
			break; //如果下一个方向的格子距离很远，就跳出这个，在下面交换节点，寻找f最小值
		} else {
			swap(child, curr); // 交换节点，假设一下curr 为 1，child则为3
			curr = child; // 再判断当前孩子节点 ，这里 curr 成为了3
			child = curr * 2 + 1; // 再判断左孩子 ，child为7
		}
	}
	if (curr != nIndex) {
		return;
	}
	// 往上调整( 只需要比较cuur child和parent )
	while (curr != 0) {
		if (open_table[curr].s_g + open_table[curr].s_h >= open_table[parent].s_g + open_table[parent].s_h) {
			break; // 如果下一个方向的格子距离很近，就跳出这个，
		} else {
			swap(curr, parent);
			curr = parent;
			parent = Math.floor((curr - 1) / 2);
		}
	}
}
// 交换节点
function swap(idx1, idx2) {
	let tmp = open_table[idx1];
	open_table[idx1] = open_table[idx2];
	open_table[idx2] = tmp;
}
//每次调用都得初始化，重新装载路径
function astar_init(map) {
	// console.log(map, "===>map"); 
	//初始化障碍物和地图坐标
	open_table = []; //可行走的表格
	close_table = []; //不可行走的表格
	path_stack = []; // 路径
	map_maze = []; // 地图
	//每个格子的高宽
	map_height = map.height;
	map_width = map.width;
	is_found = 0; //0 表示路径不可行 1可行
	open_node_count = 0; //可行走的路径记录下标
	close_node_count = 0; //行走后的路径记录下标
	top = -1; //path_stack数组的下标
	for (let i = 0; i < map.height; i++) {
		for (let j = 0; j < map.width; j++) {
			let node = {};
			node.s_g = 0;
			node.s_h = 0;
			//标志当前格子是否走过
			node.s_is_in_closetable = 0;
			node.s_is_in_opentable = 0;

			node.s_style = map.data[i * map.width + j]; // 地图是json格式，只有已1，0，标志哪些是可行格子0 可行，1障碍物
			node.s_x = i; //移动的x坐标
			node.s_y = j; //移动的y坐标
			node.s_parent = null;
			map_maze.push(node);

			path_stack.push(null);
			open_table.push(null);
			close_table.push(null);
		}
	}
	// console.log(map_maze,"===>地图坐标信息") 
}
module.exports = {
	search: astar_search,
};
