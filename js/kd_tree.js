/**
 * @author Kim SAVAROCHE
 * @date 06/10/2014
 *
 * K-D Tree
 * 2D only : ["x", "y"] so a binary tree should be helpful...
 */

function nodeTree(object, dimension, parent) 
{
	this.object = object;
	this.left = null;
	this.right = null;
	this.parent = parent;
	this.dimension = dimension;
}

function calculateDistance(pointA, pointB) 
{
	var distanceX = pointA.x - pointB.x;
	var distanceY = pointA.y - pointB.y;

	return distanceX*distanceX + distanceY*distanceY;
}

function kdTree(points, dimensions) 
{
	this.root = buildTree(points, 0, null);

	// Build the binary tree
	function buildTree(points, depth, parent) 
	{
		var dim = depth % dimensions.length;
		var median;
		var node;

		if(points.length === 0) 
		{
			return null;
		}
		if(points.length === 1) 
		{
			return new nodeTree(points[0], dim, parent);
		}

		median = Math.floor(points.length / 2);
		node = new nodeTree(points[median], dim, parent);
		node.left = buildTree(points.slice(0, median), depth + 1, node);
		node.right = buildTree(points.slice(median + 1), depth + 1, node);

		return node;
	}

	// Insert a node as a leaf
	// Go throught branches until we find a leaf
	// Link the old leaf with the new node
	// The new node becomes the nex leaf
	this.insert = function(point) 
	{
		function findPositionForInsert(node, parent) 
		{
			if(node === null) 
			{
				return parent;
			}

			var dimension = dimensions[node.dimension];

			if(point[dimension] < node.object[dimension]) 
			{
				return findPositionForInsert(node.left, node);
			} 
			else 
			{
				return findPositionForInsert(node.right, node);
			}
		}

		var insertPosition = findPositionForInsert(this.root, null), newNode, dimension;

		// If the insert position is null Then it is the first node so it's the root
		// Else it's a new node so link it to the point/node at the insert position
		if(insertPosition === null) 
		{
			this.root = new nodeTree(point, 0, null);
		}
		else
		{
			newNode = new nodeTree(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
			dimension = dimensions[insertPosition.dimension];

			if(point[dimension] < insertPosition.object[dimension]) 
			{
				insertPosition.left = newNode;
			} 
			else 
			{
				insertPosition.right = newNode;
			}
		}
	};

	this.getNearest = function (pointCLicked, nbMaxNodesKept)
	{
		var iNode;
		var result = [];
		var bestNodes = new BinaryHeap(
			function (event) 
			{
				// Carefull, minus is important !
				return -event;
			}
		);

		nearestNeighbourSearch(this.root);

		for(iNode = 0; iNode < nbMaxNodesKept; iNode++) 
		{
			if(bestNodes.content[iNode][0]) 
			{
				result.push([bestNodes.content[iNode][0].object, bestNodes.content[iNode][1]]);
			}
		}

		return result;

		function saveNode(node, distance) 
		{
			bestNodes.push([node, distance]);
			
			if(bestNodes.size() > nbMaxNodesKept) 
			{
				bestNodes.pop();
			}
		}

		function nearestNeighbourSearch(node) 
		{
			var bestChild;
			var dimension = dimensions[node.dimension];
			var distanceToTest = calculateDistance(pointCLicked, node.object);
			var orthographicProjectionPoint = {};

			// Create the orthographicProjectionPoint on
			// - y axis (for dimension 0), keep pointClicked.x
			// - x axis (for dimension 0), keep pointClicked.y
			// Can do it because we think in a binary way : more or less ?
			for(var iDimension = 0; iDimension < dimensions.length; iDimension++) 
			{
				if(iDimension === node.dimension) 
				{
					orthographicProjectionPoint[dimensions[iDimension]] = pointCLicked[dimensions[iDimension]];
				} 
				else 
				{
					orthographicProjectionPoint[dimensions[iDimension]] = node.object[dimensions[iDimension]];
				}
			}

			// Get distance beetween the orthographicProjectionPoint and the node
			var orthographicDistance = calculateDistance(orthographicProjectionPoint, node.object);

			// Is the node a leaf ?
			// - yes so can't go down any further...
			if(node.right === null && node.left === null) 
			{
				if(bestNodes.size() < nbMaxNodesKept || distanceToTest < bestNodes.peek()[1]) 
				{
					saveNode(node, distanceToTest);
				}
				return;
			}

			// Check the child on each node's side : change the bestChild to test
			// Will tell wich next node will be next to test
			if(node.right === null) 
			{
				bestChild = node.left;
			} 
			else if(node.left === null) 
			{
				bestChild = node.right;
			} 
			else 
			{
				if(pointCLicked[dimension] < node.object[dimension]) 
				{
					bestChild = node.left;
				} 
				else 
				{
					bestChild = node.right;
				}
			}
			nearestNeighbourSearch(bestChild);

			// Save the best choice
			if(bestNodes.size() < nbMaxNodesKept || distanceToTest < bestNodes.peek()[1]) 
			{
				saveNode(node, distanceToTest);
			}

			// The score is better than the previous
			// Going down the tree until :
			// - the score is not better
			// - the node is a leaf
			if(bestNodes.size() < nbMaxNodesKept || Math.abs(orthographicDistance) < bestNodes.peek()[1]) 
			{
				var otherChild;

				if(bestChild === node.left) 
				{
					otherChild = node.right;
				} 
				else 
				{
					otherChild = node.left;
				}
				
				if(otherChild !== null) 
				{
					nearestNeighbourSearch(otherChild);
				}
			}
		}
	};
}
