/**
 * @author Kim SAVAROCHE
 * @date 06/10/2014
 *
 * Binary Heap
 *
 * Inspired by : http://eloquentjavascript.net/appendix2.html
 */

function BinaryHeap(scoreFunction)
{
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = 
{
	push: function(element) 
	{
		// Add the new element to the end of the array.
		this.content.push(element);
		// Allow it to bubble up.
		this.bubbleUp(this.content.length - 1);
	},

	pop: function() 
	{
		// Store the first element : can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();

		// If there is any element left
		// Then put the end element at the start
		// Let it sink down.
		if(this.content.length > 0) 
		{
			this.content[0] = end;
			this.sinkDown(0);
		}
		
		return result;
	},

	peek: function() 
	{
		return this.content[0];
	},

	remove: function(node) 
	{
		var length = this.content.length;
		// Search through the array to find the value
		for (var iNode = 0; i < length; iNode++) 
		{
			if(this.content[iNode] == node)
			{
				// The value is found
				// Repeat pop function so there is no blank spot
				var end = this.content.pop();
				if(iNode != length - 1) 
				{
					this.content[iNode] = end;
					
					if(this.scoreFunction(end) < this.scoreFunction(node))
					{
						this.bubbleUp(iNode);
					}
					else
					{
						this.sinkDown(iNode);
					}	
				}
				return;
			}
		}
		throw new Error("Node not found.");
	},

	size: function() 
	{
		return this.content.length;
	},

	bubbleUp: function(n) 
	{
		// Fetch the element that has to be moved
		var element = this.content[n];
		// When at 0, an element can not go up any further
		while(n > 0) 
		{
			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor((n + 1) / 2) - 1;
			parent = this.content[parentN];

			// Swap the elements if the parent is greater
			if(this.scoreFunction(element) < this.scoreFunction(parent)) 
			{
				this.content[parentN] = element;
				this.content[n] = parent;

				// Update 'n' to continue at the new position
				n = parentN;
			}

			// Found a parent that is less, no need to move it further
			else 
			{
				break;
			}
		}
	},

	sinkDown: function(n) 
	{
		// Look up the target element and its score
		var length = this.content.length,
		element = this.content[n],
		elementScore = this.scoreFunction(element);

		while(true) 
		{
			// Compute the indices of the child elements
			var child2N = (n + 1) * 2, child1N = child2N - 1;

			// Store the new element's position if possible
			var swap = null;

			// If the first child exists (is inside the array)...
			if(child1N < length) 
			{
				// Look it up and compute its score
				var child1 = this.content[child1N],
				child1Score = this.scoreFunction(child1);
				
				// If the score is less than the current element's, then swap
				if(child1Score < elementScore)
				{
					swap = child1N;
				}
			}
			
			// Do the same checks for the other child
			if(child2N < length) 
			{
				var child2 = this.content[child2N],
				child2Score = this.scoreFunction(child2);

				if(child2Score < (swap == null ? elementScore : child1Score))
				{
					swap = child2N;
				}
			}

			// If the element needs to be moved then swap it and continue
			if(swap != null) 
			{
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}
			else 
			{
				break;
			}
		}
	}
};