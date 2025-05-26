const axios = require("axios");

exports.searchStackOverflowQuestions = async (req, res) => {
  try {
    const { query, tags, page = 1, pagesize = 100 } = req.query;

    const params = {
      site: "stackoverflow",
      page,
      pagesize,
      order: "desc",
      sort: "activity",
      filter: "withbody",
    };
    
    if (query && query.trim() !== '') {
      const words = query.trim().split(/\s+/).filter(word => word.length > 0);
      
      if (words.length > 0) {
        params.intitle = words.join(' OR ');
      }
    }

    if (tags && tags.trim() !== '') {
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .join(';');
      
      params.tagged = formattedTags;
    }

    const response = await axios.get(
      "https://api.stackexchange.com/2.3/questions",
      { params }
    );

    res.render("stackoverflow-search", {
      title: "Stack Overflow Search",
      user: req.user,
      results: response.data.items || [],
      query,
      tags,
      currentPage: parseInt(page),
      hasMore: response.data.has_more || false,
      totalResults: (response.data.items || []).length,
    });
  } catch (error) {
    res.render("stackoverflow-search", {
      title: "Stack Overflow Search",
      user: req.user,
      results: [],
      query: req.query.query || "",
      tags: req.query.tags || "",
      currentPage: parseInt(req.query.page || 1),
      hasMore: false,
      totalResults: 0,
      error: "Failed to fetch results. Please try again."
    });
  }
};

exports.getStackOverflowQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const questionResponse = await axios.get(
      `https://api.stackexchange.com/2.3/questions/${id}`,
      {
        params: {
          site: "stackoverflow",
          filter: "withbody",
        },
      }
    );

    if (!questionResponse.data.items || questionResponse.data.items.length === 0) {
      return res.redirect('/stackoverflow/search');
    }

    const answersResponse = await axios.get(
      `https://api.stackexchange.com/2.3/questions/${id}/answers`,
      {
        params: {
          site: "stackoverflow",
          filter: "withbody",
          order: "desc",
          sort: "votes",
        },
      }
    );

    res.render("stackoverflow-question", {
      title: "Stack Overflow Question",
      user: req.user,
      question: questionResponse.data.items[0],
      answers: answersResponse.data.items || [],
    });
  } catch (error) {
    res.redirect('/stackoverflow/search');
  }
};
